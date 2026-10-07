// Capa de comunicación con el proveedor de IA.
// El motor solo conoce la interfaz ChatProvider. Del lado del cliente no hay API keys:
// el historial va a /api/chat y el servidor llama al modelo.

export type WireMessage = { role: 'user' | 'assistant'; content: string };

export type ChatProvider = {
  name: string;
  complete(args: { messages: WireMessage[]; signal?: AbortSignal }): Promise<string>;
};

export type ProviderErrorCode =
  | 'aborted'
  | 'network'
  | 'rate_limited'
  | 'not_configured'
  | 'server'
  | 'bad_response'
  | 'timeout';

export class ProviderError extends Error {
  code: ProviderErrorCode;
  constructor(code: ProviderErrorCode, message?: string) {
    super(message || code);
    this.code = code;
  }
}

export function httpProvider(endpoint = '/api/chat'): ChatProvider {
  return {
    name: 'http',
    async complete({ messages, signal }) {
      let res: Response;
      try {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
          signal
        });
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') throw new ProviderError('aborted');
        throw new ProviderError('network', 'No hay conexión con el servidor.');
      }
      const data = (await res.json().catch(() => null)) as { reply?: unknown; error?: string } | null;
      if (res.status === 429) throw new ProviderError('rate_limited');
      if (res.status === 503 && data?.error === 'not_configured') throw new ProviderError('not_configured');
      if (!res.ok) throw new ProviderError('server', `HTTP ${res.status}`);
      if (!data || typeof data.reply !== 'string') throw new ProviderError('bad_response');
      return data.reply;
    }
  };
}
