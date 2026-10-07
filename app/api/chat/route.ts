// Endpoint del chat. La API key se lee de GEMINI_API_KEY en el servidor y nunca llega al navegador.
// El system prompt también vive acá: el cliente solo manda el historial.

import { ApiError, GoogleGenAI, type Content } from '@google/genai';
import { buildSystemPrompt } from '@/lib/chat/store';

export const runtime = 'nodejs';

// Modelo configurable por variable de entorno. gemini-2.5-flash tiene capa gratuita en Google AI Studio.
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const MAX_MESSAGES = 16;
const MAX_LEN = 2000;
const SYSTEM = buildSystemPrompt();

// Límite simple por IP: 20 consultas por minuto. Vive en memoria, así que es por instancia;
// en serverless con varias instancias conviene reemplazarlo por uno compartido (Upstash, Vercel KV).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

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
  if (rateLimited(ip)) return Response.json({ error: 'rate_limited' }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { messages?: unknown } | null;
  const messages = body?.messages;
  if (!isValid(messages)) return Response.json({ error: 'invalid_messages' }, { status: 400 });

  client ??= new GoogleGenAI({ apiKey });

  // Gemini llama "model" al asistente.
  const contents: Content[] = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM,
        maxOutputTokens: 600,
        temperature: 0.6,
        // Chat de soporte: respuestas rápidas, sin gastar tokens en "pensar".
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    const reply = (response.text || '').trim();
    if (!reply) {
      console.warn('[api/chat] respuesta vacía', response.promptFeedback?.blockReason, response.candidates?.[0]?.finishReason);
      return Response.json({ error: 'empty_reply' }, { status: 502 });
    }
    return Response.json({ reply });
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('[api/chat] gemini', error.status, error.message);
      // 429 = cuota gratuita agotada o demasiadas consultas por minuto.
      if (error.status === 429) return Response.json({ error: 'rate_limited' }, { status: 429 });
      return Response.json({ error: 'upstream_error' }, { status: 502 });
    }
    console.error('[api/chat]', error);
    return Response.json({ error: 'upstream_error' }, { status: 502 });
  }
}
