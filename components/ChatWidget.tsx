'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatSession, type ChatMessage, type ChatSnapshot } from '@/lib/chat/engine';
import { httpProvider } from '@/lib/chat/provider';
import { motionOn } from '@/lib/motion';
import { QUICK_REPLIES } from '@/lib/chat/store';
import { FOCUS_CHAT_EVENT } from './FocusChatLink';
import { ArrowRight, ArrowUp, RotateCcw } from './icons';

const STEPS = ['Preparado', 'Despachado', 'Entregado'];

// El bot real de Código Mate (sección Probalo). La vitrina del hero está en HeroShowcase.
export default function ChatWidget() {
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
    const onFocus = (e: Event) => {
      const q = (e as CustomEvent<string | undefined>).detail;
      if (q) sendRef.current(q);
      else inputRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener(FOCUS_CHAT_EVENT, onFocus);
    return () => window.removeEventListener(FOCUS_CHAT_EVENT, onFocus);
  }, []);

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
  };

  sendRef.current = send;

  let chipLabels: string[] = [];
  if (!loading && last && last.role === 'assistant') chipLabels = last.options?.length ? last.options : QUICK_REPLIES;

  const canSend = !!draft.trim() && chat.status !== 'loading';
  const chatError = chat.status === 'error' ? chat.error : null;
  const canRetry = !!chatError && last?.role === 'user';

  const chatSection = (
    <section className="chat chat--page" aria-label="Chat con Mati, agente de Código Mate">
      <div className="chat__head">
        <div aria-hidden="true" className="avatar">M</div>
        <div className="chat__who">
          <span className="chat__name">Mati · Código Mate</span>
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
      <div className="chat__credit">Hecho por Código Mate</div>
    </section>
  );

  return <div id="demo" className="demo demo--page">{chatSection}</div>;
}
