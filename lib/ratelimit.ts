// Límite de uso por clave. Con Upstash Redis (UPSTASH_REDIS_REST_URL/TOKEN o KV_REST_API_URL/TOKEN, que carga solo
// la integración de Vercel) el conteo es compartido entre instancias. Sin Redis, o si falla, cae a memoria local.

const URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const mem = new Map<string, number[]>();

function inMemory(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (mem.get(key) || []).filter(t => now - t < windowMs);
  recent.push(now);
  mem.set(key, recent);
  if (mem.size > 5000) mem.clear();
  return recent.length > max;
}

// true = pasó el límite. Ventana fija: INCR + EXPIRE (solo la primera vez) en una sola consulta.
export async function rateLimit(key: string, max: number, windowSec: number): Promise<boolean> {
  if (URL && TOKEN) {
    try {
      const res = await fetch(`${URL}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([['INCR', `rl:${key}`], ['EXPIRE', `rl:${key}`, String(windowSec), 'NX']]),
        signal: AbortSignal.timeout(1500)
      });
      if (res.ok) {
        const out = (await res.json()) as { result?: number }[];
        return Number(out?.[0]?.result) > max;
      }
    } catch {
      // Redis no respondió: no se bloquea a nadie por eso; se usa el conteo local.
    }
  }
  return inMemory(key, max, windowSec * 1000);
}

export const clientIp = (req: Request) => (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
