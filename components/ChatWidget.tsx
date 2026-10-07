'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatSession, type ChatMessage, type ChatSnapshot } from '@/lib/chat/engine';
import { httpProvider } from '@/lib/chat/provider';
import { motionOn } from '@/lib/motion';
import { QUICK_REPLIES } from '@/lib/chat/store';
import { FOCUS_CHAT_EVENT } from './FocusChatLink';
import { ArrowRight, ArrowUp, RotateCcw } from './icons';

// Conversación que se reproduce en loop hasta que alguien interactúa con el chat.
const DEMO: ChatMessage[] = [
  { id: 'd0', role: 'assistant', text: '¡Hola! Soy Mati, el asistente de Tienda Nómade. ¿En qué te ayudo?', attachments: [] },
  { id: 'd1', role: 'user', text: 'Quiero saber dónde está mi pedido #4821', attachments: [] },
  {
    id: 'd2',
    role: 'assistant',
    text: 'Tu pedido salió hoy del depósito. Llega el jueves entre las 9 y las 13 h.',
    attachments: [{ type: 'order', id: '4821', status: 'En camino', step: 2, eta: '' }]
  },
  { id: 'd3', role: 'user', text: '¿Puedo cambiar la dirección de entrega?', attachments: [] },
  {
    id: 'd4',
    role: 'assistant',
    text: 'Sí, todavía estamos a tiempo. Te paso con Lucía para confirmarla.',
    attachments: [{ type: 'handoff', human: 'Lucía' }]
  }
];

const STEPS = ['Preparado', 'Despachado', 'Entregado'];

// showcase: vitrina del hero (loop de la tienda demo, sin escribir). Sin showcase: el bot real de Código Mate.
export default function ChatWidget({ showcase = false }: { showcase?: boolean }) {
  const [demo, setDemo] = useState(showcase);
  const [demoN, setDemoN] = useState(0);
  const [demoTyping, setDemoTyping] = useState(false);
  const [chat, setChat] = useState<ChatSnapshot>({ messages: [], status: 'idle', error: null });
  const [draft, setDraft] = useState('');

  const sessionRef = useRef<ChatSession | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedRef = useRef(false);
  const demoRef = useRef(showcase);
  const loopedRef = useRef(false);

  if (!sessionRef.current) {
    sessionRef.current = new ChatSession({ provider: httpProvider('/api/chat') });
  }

  useEffect(() => {
    const session = sessionRef.current!;
    session.onChange = setChat;
    setChat(session.snapshot());
    reducedRef.current = !motionOn();
    if (reducedRef.current) setDemoN(DEMO.length);
    return () => {
      session.onChange = () => {};
    };
  }, []);

  // Loop del demo: el asistente "escribe", aparece el mensaje, y al terminar vuelve a empezar.
  useEffect(() => {
    if (!demo || reducedRef.current) return;
    let t: ReturnType<typeof setTimeout>;
    if (demoN >= DEMO.length) {
      t = setTimeout(() => {
        loopedRef.current = true;
        setDemoN(0);
      }, 9000);
    } else if (DEMO[demoN].role === 'assistant' && !demoTyping) {
      t = setTimeout(() => setDemoTyping(true), demoN > 0 ? 450 : loopedRef.current ? 900 : 1400);
    } else {
      t = setTimeout(() => {
        setDemoTyping(false);
        setDemoN(n => n + 1);
      }, demoTyping ? 1100 : 1700);
    }
    return () => clearTimeout(t);
  }, [demo, demoN, demoTyping]);

  const takeOver = useCallback(() => {
    if (!demoRef.current) return;
    demoRef.current = false;
    sessionRef.current?.reset();
    setDemo(false);
    setDemoTyping(false);
  }, []);

  const sendRef = useRef<(t: string) => void>(() => {});
  useEffect(() => {
    if (showcase) return;
    const onFocus = (e: Event) => {
      const q = (e as CustomEvent<string | undefined>).detail;
      if (q) sendRef.current(q);
      else inputRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener(FOCUS_CHAT_EVENT, onFocus);
    return () => window.removeEventListener(FOCUS_CHAT_EVENT, onFocus);
  }, [showcase]);

  const list: ChatMessage[] = demo ? DEMO.slice(0, demoN) : chat.messages;
  const loading = demo ? demoTyping : chat.status === 'loading';
  const last = list[list.length - 1];

  // Autoscroll al último mensaje.
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.scrollTo({ top: el.scrollHeight, behavior: reducedRef.current ? 'auto' : 'smooth' }));
  }, [demo, demoN, demoTyping, chat.messages.length, chat.status]);

  const send = async (text: string) => {
    takeOver();
    const sent = await sessionRef.current!.send(text);
    if (sent) setDraft('');
  };

  sendRef.current = send;

  let chipLabels: string[] = [];
  if (showcase) chipLabels = [];
  else if (!loading && last && last.role === 'assistant') chipLabels = last.options?.length ? last.options : QUICK_REPLIES;

  const canSend = !!draft.trim() && !(!demo && chat.status === 'loading');
  const chatError = !demo && chat.status === 'error' ? chat.error : null;
  const canRetry = !!chatError && last?.role === 'user';

  const chatSection = (
    <section
      className={showcase ? 'chat' : 'chat chat--page'}
      aria-label={showcase ? 'Ejemplo: Mati, asistente de Tienda Nómade' : 'Chat con Mati, agente de Código Mate'}
      {...(showcase ? { 'aria-hidden': true, inert: true } : null)}
    >
      <div className="chat__head">
        <div aria-hidden="true" className="avatar">M</div>
        <div className="chat__who">
          <span className="chat__name">{showcase ? 'Mati · Tienda Nómade' : 'Mati · Código Mate'}</span>
          <span className="chat__state">En línea · responde al instante</span>
        </div>
        {!showcase && (
          <button
            type="button"
            className="chat__reset"
            aria-label="Empezar una conversación nueva"
            title="Nueva conversación"
            onClick={() => {
              takeOver();
              sessionRef.current?.reset();
              setDraft('');
            }}
          >
            <RotateCcw />
          </button>
        )}
      </div>

      <div ref={logRef} className="chat__log" data-lenis-prevent role="log" aria-live="polite" aria-relevant="additions">
        {list.map(m =>
          m.role === 'assistant' ? (
            <div key={m.id} className="msg-bot">
              {m.text && <div className="bubble-bot">{m.text}</div>}
              {m.attachments.map((a, j) =>
                a.type === 'order' ? (
                  <div key={j} className="order">
                    <div className="order__top">
                      <span className="order__id">Pedido #{a.id}</span>
                      <span className="order__status">{a.status}</span>
                    </div>
                    <div
                      className="order__track"
                      role="progressbar"
                      aria-label="Avance del envío"
                      aria-valuemin={0}
                      aria-valuemax={3}
                      aria-valuenow={a.step}
                    >
                      <div className="order__fill" style={{ width: `${Math.round((a.step / 3) * 100)}%` }} />
                    </div>
                    <div className="order__steps">
                      {STEPS.map(s => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                ) : a.type === 'book' ? (
                  <a key={j} href="#agendar" className="handoff handoff--link">
                    Agendar una llamada <ArrowRight size={14} />
                  </a>
                ) : (
                  <div key={j} className="handoff">
                    Continuar en WhatsApp con {a.human} <ArrowRight size={14} />
                  </div>
                )
              )}
            </div>
          ) : (
            <div key={m.id} className="bubble-user">
              {m.text}
            </div>
          )
        )}

        {loading && (
          <div className="typing" role="status" aria-label="Mati está escribiendo">
            <span />
            <span />
            <span />
          </div>
        )}

        {chipLabels.length > 0 && (
          <div className="chips">
            {chipLabels.map((label, i) => (
              <button key={label} type="button" className="chip" style={{ animationDelay: `${0.15 + i * 0.08}s` }} onClick={() => send(label)}>
                {label}
              </button>
            ))}
          </div>
        )}

        {chatError && (
          <div className="chat-error" role="alert">
            <span>{chatError}</span>
            {canRetry && (
              <button type="button" onClick={() => sessionRef.current?.retry()}>
                Reintentar
              </button>
            )}
          </div>
        )}
      </div>

      {!showcase && (
        <form
          className="composer"
          onSubmit={e => {
            e.preventDefault();
            if (canSend) send(draft);
          }}
        >
          <label htmlFor="cm-chat-input" className="sr-only">
            Escribí tu consulta
          </label>
          <input
            id="cm-chat-input"
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Escribí tu consulta…"
            maxLength={500}
            autoComplete="off"
            enterKeyHint="send"
          />
          <button type="submit" aria-label="Enviar mensaje" disabled={!canSend}>
            <ArrowUp />
          </button>
        </form>
      )}
      <div className="chat__credit">Hecho por Código Mate</div>
    </section>
  );

  if (!showcase) return <div id="demo" className="demo demo--page">{chatSection}</div>;

  return (
    <div className="demo">
      <div className="browser">
        <div className="browser__bar">
          <span aria-hidden="true" className="browser__dot" />
          <span aria-hidden="true" className="browser__dot" />
          <span aria-hidden="true" className="browser__dot" />
          <div className="browser__url">tiendanomade.com.ar/mi-cuenta</div>
        </div>
        <div className="browser__body">
          <div aria-hidden="true" className="browser__skeleton">
            <div />
            <div />
            <div />
            <div />
          </div>
          {chatSection}
        </div>
      </div>
      <div className="demo__caption">
        <span aria-hidden="true" className="demo__dot is-live" />
        <span>Así atiende tu web: consulta de pedido y pase a WhatsApp.</span>
      </div>
    </div>
  );
}
