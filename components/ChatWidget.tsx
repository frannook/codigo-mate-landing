'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatSession, type ChatMessage, type ChatSnapshot } from '@/lib/chat/engine';
import { httpProvider } from '@/lib/chat/provider';
import { motionOn } from '@/lib/motion';
import { QUICK_REPLIES } from '@/lib/chat/store';
import { waLink } from '@/lib/site';
import { FOCUS_CHAT_EVENT } from './FocusChatLink';
import { track } from '@vercel/analytics';
import { ArrowRight, ArrowUp, RotateCcw } from './icons';

const STEPS = ['Preparado', 'Despachado', 'Entregado'];

// Texto con el que se abre WhatsApp: quién escribe y la última consulta hecha en el chat, para no repetirla.
function whatsappMessage(list: ChatMessage[], upTo: number): string {
  const last = [...list.slice(0, upTo)].reverse().find(m => m.role === 'user');
  const q = last?.text?.trim().slice(0, 300);
  return q ? `Hola, vengo de la web de Código Mate. Estaba hablando con Yuyo y quiero seguir con una persona. Mi consulta: ${q}` : 'Hola, vengo de la web de Código Mate y quiero hablar con una persona.';
}

// El bot real de Código Mate (sección Probalo). La vitrina del hero está en HeroShowcase.
// `floating`: versión de la burbuja flotante (YuyoLauncher): sin id de ancla, con botón para cerrar.
export default function ChatWidget({ floating = false, onClose }: { floating?: boolean; onClose?: () => void }) {
  const [chat, setChat] = useState<ChatSnapshot>({ messages: [], status: 'idle', error: null });
  const [draft, setDraft] = useState('');

  const sessionRef = useRef<ChatSession | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedRef = useRef(false);

  if (!sessionRef.current) {
    sessionRef.current = new ChatSession({ provider: httpProvider('/api/chat') });
  }

  useEffect(() => {
    const session = sessionRef.current!;
    session.onChange = setChat;
    setChat(session.snapshot());
    reducedRef.current = !motionOn();
    return () => {
      session.onChange = () => {};
    };
  }, []);

  const sendRef = useRef<(t: string) => void>(() => {});
  useEffect(() => {
    if (floating) return; // los enlaces "Probalo" apuntan al chat de la página, no a la burbuja
    const onFocus = (e: Event) => {
      const q = (e as CustomEvent<string | undefined>).detail;
      if (q) sendRef.current(q);
      else inputRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener(FOCUS_CHAT_EVENT, onFocus);
    return () => window.removeEventListener(FOCUS_CHAT_EVENT, onFocus);
  }, [floating]);

  const list: ChatMessage[] = chat.messages;
  const loading = chat.status === 'loading';
  const last = list[list.length - 1];

  // Autoscroll al último mensaje.
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.scrollTo({ top: el.scrollHeight, behavior: reducedRef.current ? 'auto' : 'smooth' }));
  }, [chat.messages.length, chat.status]);

  const send = async (text: string) => {
    // El mensaje ya aparece en la charla: se vacía el campo al instante y vuelve si no se pudo enviar.
    setDraft('');
    const sent = await sessionRef.current!.send(text);
    if (!sent) setDraft(d => d || text);
    else track('chat_message');
  };

  sendRef.current = send;

  let chipLabels: string[] = [];
  if (!loading && last && last.role === 'assistant') chipLabels = last.options?.length ? last.options : QUICK_REPLIES;

  const canSend = !!draft.trim() && chat.status !== 'loading';
  const chatError = chat.status === 'error' ? chat.error : null;
  const canRetry = !!chatError && last?.role === 'user';

  const chatSection = (
    <section className={`chat ${floating ? 'chat--float' : 'chat--page'}`} aria-label="Chat con Yuyo, agente de Código Mate">
      <div className="chat__head">
        <div aria-hidden="true" className="avatar av-1">Y</div>
        <div className="chat__who">
          <span className="chat__name">Yuyo · Código Mate</span>
          <span className="chat__state">En línea · responde al instante</span>
        </div>
        <button
            type="button"
            className="chat__reset"
            aria-label="Empezar una conversación nueva"
            title="Nueva conversación"
            onClick={() => {
              sessionRef.current?.reset();
              setDraft('');
            }}
          >
            <RotateCcw />
          </button>
        {onClose && (
          <button type="button" className="chat__reset" aria-label="Cerrar el chat" title="Cerrar" onClick={onClose}>
            <span aria-hidden="true" style={{ fontSize: 22, lineHeight: 1 }}>×</span>
          </button>
        )}
      </div>

      <div ref={logRef} className="chat__log" data-lenis-prevent role="log" aria-live="polite" aria-relevant="additions">
        {list.map((m, mi) =>
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
                  <a
                    key={j}
                    href={waLink(whatsappMessage(list, mi))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="handoff handoff--link"
                    onClick={() => track('whatsapp_click')}
                  >
                    Seguir por WhatsApp con una persona <ArrowRight size={14} />
                  </a>
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
          <div className="typing" role="status" aria-label="Yuyo está escribiendo">
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

      <form
          className="composer"
          onSubmit={e => {
            e.preventDefault();
            if (canSend) send(draft);
          }}
        >
          <label htmlFor={floating ? 'cm-chat-input-float' : 'cm-chat-input'} className="sr-only">
            Escribí tu consulta
          </label>
          <input
            id={floating ? 'cm-chat-input-float' : 'cm-chat-input'}
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
      <div className="chat__credit">Hecho por Código Mate</div>
    </section>
  );

  if (floating) return <div className="demo demo--float">{chatSection}</div>;
  return <div id="demo" className="demo demo--page">{chatSection}</div>;
}
