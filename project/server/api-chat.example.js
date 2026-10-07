// Ejemplo de endpoint seguro para producción (Vercel / Netlify / Node 18+).
// Renombrar a api/chat.js en el proyecto real. NO se ejecuta en esta vista previa.
// La key se lee de una variable de entorno del servidor: ANTHROPIC_API_KEY (nunca en el frontend).

import { buildSystemPrompt } from '../chat/chat-engine.js';

const MODEL = 'claude-haiku-4-5';
const MAX_MESSAGES = 16;
const MAX_LEN = 500;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const messages = Array.isArray(req.body?.messages) ? req.body.messages.slice(-MAX_MESSAGES) : null;
  const valid = messages && messages.length && messages.every(m =>
    (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.length <= MAX_LEN * 4);
  if (!valid || messages[0].role !== 'user') return res.status(400).json({ error: 'invalid_messages' });

  // TODO producción: rate limit por IP/sesión (ej. Upstash, Vercel KV) y CORS restringido a tu dominio.

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: buildSystemPrompt(), messages })
    });
    if (r.status === 429) return res.status(429).json({ error: 'rate_limited' });
    if (!r.ok) return res.status(502).json({ error: 'upstream_error' });
    const data = await r.json();
    const reply = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
    return res.status(200).json({ reply });
  } catch {
    return res.status(502).json({ error: 'upstream_error' });
  }
}
