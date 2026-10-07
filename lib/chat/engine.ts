// Lógica del chat: historial, estados, validación, errores y reintentos.
// No sabe nada de la UI ni de qué proveedor responde.

import { DEMO_STORE, QUICK_REPLIES, type Store } from './store';
import { ProviderError, type ChatProvider, type WireMessage } from './provider';

export type Attachment =
  | { type: 'order'; id: string; status: string; step: number; eta: string }
  | { type: 'handoff'; human: string }
  | { type: 'book' };

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  attachments: Attachment[];
  options?: string[];
};

export type ChatStatus = 'idle' | 'loading' | 'error';

export type ChatSnapshot = {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
};

const ERRORS: Record<string, string> = {
  rate_limited: 'Hay muchas consultas en este momento. Probá de nuevo en unos segundos.',
  network: 'Se cortó la conexión. Revisá tu internet y probá de nuevo.',
  timeout: 'La respuesta está tardando demasiado. Probá de nuevo.',
  not_configured: 'El asistente todavía no está conectado a un proveedor de IA.',
  default: 'No pude responder ahora. Probá de nuevo.'
};

const TAG_RE = /\[\[(PEDIDO):\s*#?(\w+)\]\]|\[\[(WHATSAPP)\]\]|\[\[(AGENDAR)\]\]/gi;
const OPT_RE = /\[\[OPCIONES:([^\]]*)\]\]/i;

export function parseReply(raw: string, store: Store) {
  const attachments: Attachment[] = [];
  const om = raw.match(OPT_RE);
  const options = om ? om[1].split('|').map(s => s.trim()).filter(Boolean).slice(0, 3) : [];
  const body = raw.replace(OPT_RE, '');
  for (const m of body.matchAll(TAG_RE)) {
    const order = m[1] ? store.orders[m[2]] : undefined;
    if (order) attachments.push({ type: 'order', id: m[2], ...order });
    if (m[3]) attachments.push({ type: 'handoff', human: store.human });
    if (m[4]) attachments.push({ type: 'book' });
  }
  const text = body.replace(TAG_RE, '').replace(/\*\*/g, '').trim();
  return { text, attachments, options };
}

let uid = 0;
const newId = () => `m${Date.now().toString(36)}${(uid++).toString(36)}`;

type Options = {
  provider: ChatProvider;
  store?: Store;
  maxLen?: number;
  maxHistory?: number;
  timeoutMs?: number;
  onChange?: (s: ChatSnapshot) => void;
};

export class ChatSession {
  provider: ChatProvider;
  store: Store;
  maxLen: number;
  maxHistory: number;
  timeoutMs: number;
  onChange: (s: ChatSnapshot) => void;
  messages: ChatMessage[] = [];
  status: ChatStatus = 'idle';
  error: string | null = null;
  private controller: AbortController | null = null;

  constructor({ provider, store = DEMO_STORE, maxLen = 500, maxHistory = 16, timeoutMs = 30000, onChange }: Options) {
    this.provider = provider;
    this.store = store;
    this.maxLen = maxLen;
    this.maxHistory = maxHistory;
    this.timeoutMs = timeoutMs;
    this.onChange = onChange || (() => {});
    this.reset();
  }

  greeting(): ChatMessage {
    return {
      id: newId(),
      role: 'assistant',
      text: `¡Hola! Soy ${this.store.agent}, el agente de ${this.store.name}. Contame a qué se dedica tu negocio y te cuento cómo te ayudaría uno en tu web.`,
      attachments: [],
      options: QUICK_REPLIES
    };
  }

  reset() {
    this.controller?.abort();
    this.controller = null;
    this.messages = [this.greeting()];
    this.status = 'idle';
    this.error = null;
    this.emit();
  }

  snapshot(): ChatSnapshot {
    return { messages: this.messages.slice(), status: this.status, error: this.error };
  }

  emit() {
    this.onChange(this.snapshot());
  }

  validate(text: string): { ok: true; text: string } | { ok: false; error?: string } {
    const t = String(text || '').trim();
    if (!t) return { ok: false };
    if (t.length > this.maxLen) return { ok: false, error: `Máximo ${this.maxLen} caracteres.` };
    return { ok: true, text: t };
  }

  async send(text: string): Promise<boolean> {
    if (this.status === 'loading') return false;
    const v = this.validate(text);
    if (!v.ok) {
      if (v.error) {
        this.error = v.error;
        this.status = 'error';
        this.emit();
      }
      return false;
    }
    this.messages.push({ id: newId(), role: 'user', text: v.text, attachments: [] });
    await this.request();
    return true;
  }

  async retry() {
    if (this.status !== 'error' || this.messages[this.messages.length - 1]?.role !== 'user') return;
    await this.request();
  }

  private async request() {
    this.status = 'loading';
    this.error = null;
    this.emit();
    const controller = new AbortController();
    this.controller = controller;
    // El saludo no se manda: la API espera que el historial empiece con el usuario.
    const history: WireMessage[] = this.messages
      .filter((m, i) => !(i === 0 && m.role === 'assistant'))
      .slice(-this.maxHistory)
      .map(m => ({ role: m.role, content: m.text }));
    while (history.length && history[0].role !== 'user') history.shift();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const raw = await Promise.race([
        this.provider.complete({ messages: history, signal: controller.signal }),
        new Promise<never>((_, rej) => {
          timer = setTimeout(() => {
            controller.abort();
            rej(new ProviderError('timeout'));
          }, this.timeoutMs);
        })
      ]);
      if (controller !== this.controller) return;
      const { text, attachments, options } = parseReply(String(raw || ''), this.store);
      if (!text && !attachments.length) throw new ProviderError('bad_response');
      this.messages.push({ id: newId(), role: 'assistant', text, attachments, options });
      this.status = 'idle';
    } catch (e) {
      // Abortado por reset(): la sesión ya arrancó de nuevo, no hay nada que mostrar.
      if (controller !== this.controller) return;
      const code = e instanceof ProviderError ? e.code : 'default';
      this.status = 'error';
      this.error = ERRORS[code] || ERRORS.default;
      console.warn('[chat]', e);
    } finally {
      clearTimeout(timer);
      if (controller === this.controller) {
        this.controller = null;
        this.emit();
      }
    }
  }
}
