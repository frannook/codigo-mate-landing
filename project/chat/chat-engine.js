// Lógica del chat: historial, estados, validación, errores y reintentos.
// No sabe nada de la UI ni de qué proveedor responde.

export const DEMO_STORE = {
  name: 'Tienda Nómade',
  agent: 'Mati',
  human: 'Lucía',
  orders: {
    '4821': { status: 'En camino', step: 2, eta: 'el jueves entre las 9 y las 13 h' },
    '4790': { status: 'Entregado', step: 3, eta: 'entregado el lunes' },
    '4833': { status: 'Preparado', step: 1, eta: 'sale del depósito mañana' }
  }
};

export const STEPS = ['Preparado', 'Despachado', 'Entregado'];

export function buildSystemPrompt(store = DEMO_STORE) {
  const orders = Object.entries(store.orders)
    .map(([id, o]) => `#${id}: ${o.status}, ${o.eta}`).join('\n');
  return `Sos ${store.agent}, el asistente de atención al cliente de ${store.name}, una tienda online argentina de ropa y accesorios de viaje. Esta es una demo creada por Código Mate, una agencia que instala agentes de IA en webs de negocios.

Reglas:
- Respondé en español rioplatense, con voseo, cálido y directo. Máximo 2 o 3 oraciones. Texto plano, sin markdown ni listas.
- Políticas: envíos a todo el país en 2 a 5 días hábiles, gratis desde $60.000. Cambios dentro de 30 días con la etiqueta puesta. Pagos con tarjeta, transferencia o Mercado Pago, hasta 3 cuotas sin interés.
- Pedidos que podés consultar:
${orders}
- Cuando informes el estado de uno de esos pedidos, agregá al final exactamente [[PEDIDO:numero]]. Si piden un número que no está, decí que no lo encontrás y pedí que lo revisen.
- Si la persona necesita algo que vos no podés resolver (cambiar una dirección, un reclamo, hablar con alguien), ofrecé pasarla con ${store.human} por WhatsApp y agregá al final exactamente [[WHATSAPP]].
- Si preguntan por Código Mate o cómo tener un asistente así en su web, explicá en una oración que esta es una demo y que pueden agendar una llamada en esta misma página.
- No inventes datos que no estén acá.
- Siempre, al final de cada respuesta, sugerí 2 o 3 próximas preguntas cortas (máximo 4 palabras cada una) que el cliente podría hacer, con este formato exacto: [[OPCIONES:pregunta uno|pregunta dos|pregunta tres]]`;
}

export const QUICK_REPLIES = ['Seguir mi pedido', 'Cambios y devoluciones', 'Medios de pago'];

const ERRORS = {
  rate_limited: 'Hay muchas consultas en este momento. Probá de nuevo en unos segundos.',
  network: 'Se cortó la conexión. Revisá tu internet y probá de nuevo.',
  timeout: 'La respuesta está tardando demasiado. Probá de nuevo.',
  not_configured: 'El asistente todavía no está conectado a un proveedor de IA.',
  default: 'No pude responder ahora. Probá de nuevo.'
};

const TAG_RE = /\[\[(PEDIDO):\s*#?(\w+)\]\]|\[\[(WHATSAPP)\]\]/gi;

const OPT_RE = /\[\[OPCIONES:([^\]]*)\]\]/i;

function parseReply(raw, store) {
  const attachments = [];
  let m;
  const om = raw.match(OPT_RE);
  const options = om ? om[1].split('|').map(s => s.trim()).filter(Boolean).slice(0, 3) : [];
  raw = raw.replace(OPT_RE, '');
  while ((m = TAG_RE.exec(raw))) {
    if (m[1] && store.orders[m[2]]) attachments.push({ type: 'order', id: m[2], ...store.orders[m[2]] });
    if (m[3]) attachments.push({ type: 'handoff', human: store.human });
  }
  TAG_RE.lastIndex = 0;
  const text = raw.replace(TAG_RE, '').replace(/\*\*/g, '').trim();
  return { text, attachments, options };
}

let uid = 0;
const id = () => `m${Date.now().toString(36)}${(uid++).toString(36)}`;

export class ChatSession {
  constructor({ provider, store = DEMO_STORE, maxLen = 500, maxHistory = 16, timeoutMs = 30000, onChange } = {}) {
    this.provider = provider;
    this.store = store;
    this.maxLen = maxLen;
    this.maxHistory = maxHistory;
    this.timeoutMs = timeoutMs;
    this.onChange = onChange || (() => {});
    this.system = buildSystemPrompt(store);
    this.reset();
  }

  greeting() {
    return { id: id(), role: 'assistant', text: `¡Hola! Soy ${this.store.agent}, el asistente de ${this.store.name}. ¿En qué te ayudo?`, attachments: [], options: QUICK_REPLIES };
  }

  reset() {
    if (this.controller) this.controller.abort();
    this.messages = [this.greeting()];
    this.status = 'idle';
    this.error = null;
    this.emit();
  }

  setProvider(p) { this.provider = p; }

  snapshot() {
    return { messages: this.messages.slice(), status: this.status, error: this.error, hasUserMessages: this.messages.some(m => m.role === 'user') };
  }

  emit() { this.onChange(this.snapshot()); }

  validate(text) {
    const t = String(text || '').trim();
    if (!t) return { ok: false };
    if (t.length > this.maxLen) return { ok: false, error: `Máximo ${this.maxLen} caracteres.` };
    return { ok: true, text: t };
  }

  async send(text) {
    if (this.status === 'loading') return false;
    const v = this.validate(text);
    if (!v.ok) { if (v.error) { this.error = v.error; this.status = 'error'; this.emit(); } return false; }
    this.messages.push({ id: id(), role: 'user', text: v.text, attachments: [] });
    await this.request();
    return true;
  }

  async retry() {
    if (this.status !== 'error' || this.messages[this.messages.length - 1]?.role !== 'user') return;
    await this.request();
  }

  async request() {
    this.status = 'loading';
    this.error = null;
    this.emit();
    this.controller = new AbortController();
    // El saludo no se manda: la API espera que el historial empiece con el usuario.
    const history = this.messages.filter((m, i) => !(i === 0 && m.role === 'assistant'))
      .slice(-this.maxHistory)
      .map(m => ({ role: m.role, content: m.text }));
    while (history.length && history[0].role !== 'user') history.shift();
    let timer;
    try {
      const raw = await Promise.race([
        this.provider.complete({ system: this.system, messages: history, signal: this.controller.signal }),
        new Promise((_, rej) => { timer = setTimeout(() => { this.controller.abort(); rej({ code: 'timeout' }); }, this.timeoutMs); })
      ]);
      const { text, attachments, options } = parseReply(String(raw || ''), this.store);
      if (!text && !attachments.length) throw { code: 'bad_response' };
      this.messages.push({ id: id(), role: 'assistant', text, attachments, options });
      this.status = 'idle';
    } catch (e) {
      if (e && e.code === 'aborted') return;
      this.status = 'error';
      this.error = ERRORS[e && e.code] || ERRORS.default;
      if (typeof console !== 'undefined') console.warn('[chat]', e);
    } finally {
      clearTimeout(timer);
      this.emit();
    }
  }
}
