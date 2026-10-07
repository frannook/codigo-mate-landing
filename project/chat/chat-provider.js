// Capa de comunicación con el proveedor de IA.
// La UI y el motor del chat solo conocen la interfaz { name, complete({ system, messages, signal }) => Promise<string> }.
// Ningún proveedor del lado del cliente maneja API keys.

export class ProviderError extends Error {
  constructor(code, message) { super(message || code); this.code = code; }
}

// Producción: tu backend (API route / serverless) recibe el historial y llama al modelo con la key guardada en el servidor.
// El system prompt vive en el servidor; acá no se envía.
function httpProvider(endpoint) {
  return {
    name: 'http',
    async complete({ messages, signal }) {
      let res;
      try {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
          signal
        });
      } catch (e) {
        if (e.name === 'AbortError') throw new ProviderError('aborted');
        throw new ProviderError('network', 'No hay conexión con el servidor.');
      }
      if (res.status === 429) throw new ProviderError('rate_limited');
      if (!res.ok) throw new ProviderError('server', `HTTP ${res.status}`);
      const data = await res.json().catch(() => null);
      if (!data || typeof data.reply !== 'string') throw new ProviderError('bad_response');
      return data.reply;
    }
  };
}

// Vista previa: el entorno de diseño expone un helper autenticado del lado del host (sin key en la página).
function previewProvider() {
  return {
    name: 'preview',
    async complete({ system, messages }) {
      try {
        return await window.claude.complete({ system, messages, max_tokens: 400 });
      } catch (e) {
        const msg = String(e && e.message || e);
        if (/rate|429|limit/i.test(msg)) throw new ProviderError('rate_limited');
        throw new ProviderError('server', msg);
      }
    }
  };
}

export function createProvider({ endpoint } = {}) {
  if (endpoint) return httpProvider(endpoint);
  if (typeof window !== 'undefined' && window.claude && typeof window.claude.complete === 'function') return previewProvider();
  return {
    name: 'none',
    async complete() { throw new ProviderError('not_configured'); }
  };
}
