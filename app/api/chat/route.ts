// Endpoint del chat. La API key se lee de GEMINI_API_KEY en el servidor y nunca llega al navegador.
// El system prompt también vive acá: el cliente solo manda el historial.

import { ApiError, GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';
import { buildSystemPrompt } from '@/lib/chat/store';
import { clientIp, rateLimit } from '@/lib/ratelimit';

export const runtime = 'nodejs';
// Margen para recorrer la cadena de modelos en Vercel.
export const maxDuration = 30;

// Modelos de la capa gratuita de Google AI Studio, en orden. GEMINI_MODEL, si está, va primero.
// Medido 2026-10: suelen responder en ~1 s, pero Google encola algunas consultas al azar (15-25 s).
const MODELS = [...new Set([process.env.GEMINI_MODEL, 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.1-flash-lite'].filter(Boolean))] as string[];
// Consultas escalonadas: si el modelo en curso no contestó en HEDGE_MS (o falló), se lanza el siguiente en paralelo
// y gana la primera respuesta. Así una consulta encolada no deja al visitante esperando.
const HEDGE_MS = 3_500;
// Respaldo opcional en otra infraestructura: cualquier proveedor con API compatible con OpenAI (Groq, OpenRouter, Cerebras, Mistral...).
// Por defecto Groq con GROQ_API_KEY; para otro proveedor: FALLBACK_API_KEY, FALLBACK_BASE_URL y FALLBACK_MODEL.
const FALLBACK_KEY = process.env.FALLBACK_API_KEY || process.env.GROQ_API_KEY;
const FALLBACK_URL = process.env.FALLBACK_BASE_URL || 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.FALLBACK_MODEL || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const DEADLINE_MS = 22_000;
const MAX_MESSAGES = 16;
const MAX_LEN = 2000;
const SYSTEM = buildSystemPrompt();

// Límite por IP: 20 consultas por minuto (compartido entre instancias si hay Redis; ver lib/ratelimit.ts).
const MAX_PER_WINDOW = 20;

type WireMessage = { role: 'user' | 'assistant'; content: string };

function isValid(messages: unknown): messages is WireMessage[] {
  return (
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= MAX_MESSAGES &&
    messages.every(
      m =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0 &&
        m.content.length <= MAX_LEN
    ) &&
    messages[0].role === 'user'
  );
}

let client: GoogleGenAI | null = null;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ error: 'not_configured' }, { status: 503 });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (await rateLimit(`chat:${ip}`, MAX_PER_WINDOW, 60)) return Response.json({ error: 'rate_limited' }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { messages?: unknown } | null;
  const messages = body?.messages;
  if (!isValid(messages)) return Response.json({ error: 'invalid_messages' }, { status: 400 });

  client ??= new GoogleGenAI({ apiKey });

  // Gemini llama "model" al asistente.
  const contents: Content[] = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const done = new AbortController();
  const deadline = setTimeout(() => done.abort(), DEADLINE_MS);
  // Razonamiento mínimo: es un chat de atención, prima la velocidad. (thinkingBudget ya no sirve en los modelos 3.x.)
  const gemini = async (model: string) => {
    const response = await client!.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM,
        maxOutputTokens: 600,
        temperature: 0.6,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        abortSignal: done.signal
      }
    });
    const reply = (response.text || '').trim();
    if (!reply) throw new Error(`respuesta vacía (${response.candidates?.[0]?.finishReason || response.promptFeedback?.blockReason || 'sin motivo'})`);
    return reply;
  };

  const groq = async () => {
    const res = await fetch(FALLBACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${FALLBACK_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 600,
        temperature: 0.6,
        messages: [{ role: 'system', content: SYSTEM }, ...messages]
      }),
      signal: done.signal
    });
    if (!res.ok) throw new Error(`respaldo ${res.status} ${(await res.text()).slice(0, 160)}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = (data.choices?.[0]?.message?.content || '').trim();
    if (!reply) throw new Error('respaldo respuesta vacía');
    return reply;
  };

  // Orden: con proveedor de respaldo configurado (Groq responde en ~0,5 s) va primero y Gemini queda de reserva;
  // sin él, el Gemini más rápido y después el resto de Gemini.
  const candidates: [string, () => Promise<string>][] = [
    ...(FALLBACK_KEY ? [[`respaldo/${GROQ_MODEL}`, groq] as [string, () => Promise<string>]] : []),
    ...MODELS.map(m => [m, () => gemini(m)] as [string, () => Promise<string>])
  ];
  const hedgeMs = FALLBACK_KEY ? 2_000 : HEDGE_MS;

  let lastError: unknown;
  const reply = await new Promise<string | null>(resolve => {
    let next = 0;
    let pending = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const launch = () => {
      clearTimeout(timer);
      if (done.signal.aborted) return; // ya hay respuesta o se venció el plazo
      if (next >= candidates.length) {
        if (!pending) resolve(null);
        return;
      }
      const [model, run] = candidates[next++];
      pending++;
      run().then(resolve, error => {
        pending--;
        if (!done.signal.aborted) {
          lastError = error;
          console.warn('[api/chat]', model, error instanceof ApiError ? `${error.status} ${error.message.slice(0, 160)}` : String(error));
        }
        // Falló rápido: no hace falta esperar, se lanza el siguiente ya.
        launch();
      });
      timer = setTimeout(launch, hedgeMs);
    };
    done.signal.addEventListener('abort', () => resolve(null));
    launch();
  });
  clearTimeout(deadline);
  done.abort(); // cancela las consultas que siguen en vuelo
  if (reply) return Response.json({ reply });

  // 429 en todos = cuota gratuita agotada o demasiadas consultas por minuto.
  if (lastError instanceof ApiError && lastError.status === 429) return Response.json({ error: 'rate_limited' }, { status: 429 });
  return Response.json({ error: 'upstream_error' }, { status: 502 });
}
