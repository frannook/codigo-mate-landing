'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// El chat se descarga recién la primera vez que se abre: la mascota no suma peso a la carga de la página.
const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });

// Lo que dice Yuyo cada vez que el mouse se le acerca (va rotando).
const PHRASES = [
  '¿Charlamos?',
  '¿Un mate?',
  '¿En qué te ayudo?',
  '¿Qué necesitás?',
  'Preguntame lo que quieras',
  '¿Tenés una tienda online?',
  'Respondo al toque',
  'Atiendo las 24 horas',
  '¿Te cuento cómo funciono?',
  '¿Agendamos una charla?'
];
const NEAR_PX = 150;

// Yuyo, una hoja de yerba con remera de Código Mate y su mate, camina por el borde inferior de la página.
// Cuando el mouse se acerca se frena, te ofrece el mate y dice algo distinto cada vez. Con un clic se abre el chat
// en una burbuja en la esquina. No tapa nada: solo la mascota recibe clics.
export default function YuyoLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false); // una vez abierto queda montado: la charla no se pierde al cerrar
  const [near, setNear] = useState(false);
  const [phrase, setPhrase] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  const walkRef = useRef<HTMLDivElement>(null);

  const toggle = (next: boolean) => {
    if (next) setLoaded(true);
    setOpen(next);
  };

  // Cercanía del mouse: un listener con rAF; solo cambia el estado al entrar o salir del radio.
  useEffect(() => {
    let raf = 0;
    let ev: PointerEvent | null = null;
    let isNear = false;
    const check = () => {
      raf = 0;
      const el = walkRef.current;
      if (!ev || !el) return;
      const r = el.getBoundingClientRect();
      const d = Math.hypot(ev.clientX - (r.left + r.width / 2), ev.clientY - (r.top + r.height / 2));
      const next = d < NEAR_PX;
      if (next === isNear) return;
      isNear = next;
      setNear(next);
      if (next) setPhrase(p => (p + 1) % PHRASES.length);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      ev = e;
      raf ||= requestAnimationFrame(check);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      btnRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    // Al abrir, el foco va al campo de texto (cuando el chat ya cargó).
    const t = window.setTimeout(() => document.getElementById('cm-chat-input-float')?.focus({ preventScroll: true }), 350);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open]);

  return (
    <div className="yuyo" data-open={open} data-near={near}>
      <div className="yuyo__walk" ref={walkRef}>
        <div className="yuyo__flip">
          <button
            ref={btnRef}
            type="button"
            className="yuyo__btn"
            aria-label="Hablar con Yuyo, el agente de Código Mate"
            aria-expanded={open}
            onClick={() => toggle(!open)}
            onFocus={() => setPhrase(p => (p + 1) % PHRASES.length)}
          >
            <svg viewBox="0 0 80 92" width="80" height="92" aria-hidden="true" focusable="false">
              {/* patitas con zapatillas */}
              <g className="yuyo__leg yuyo__leg--a">
                <rect x="30" y="72" width="5.5" height="13" rx="2.7" fill="#1b263b" />
                <path d="M26 85.5 Q26 82 31 82 Q37 82 37.5 86.5 Q37.5 88.5 35 88.5 L28 88.5 Q26 88.5 26 85.5 Z" fill="#e0e1dd" stroke="#0d1b2a" strokeWidth="1.1" />
              </g>
              <g className="yuyo__leg yuyo__leg--b">
                <rect x="44.5" y="72" width="5.5" height="13" rx="2.7" fill="#1b263b" />
                <path d="M43 86.5 Q43.5 82 49 82 Q54 82 54 85.5 Q54 88.5 52 88.5 L45 88.5 Q43 88.5 43 86.5 Z" fill="#e0e1dd" stroke="#0d1b2a" strokeWidth="1.1" />
              </g>
              <g className="yuyo__body">
                {/* hoja de yerba: borde aserrado, nervadura y venas */}
                <g className="yuyo__sprout">
                  <path
                    d="M40 3 L47 13 L52 12 L51 21 L58 22 L56 31 L63 34 L60 43 L66 47 L60 56 L63 62 L54 65 L52 73 L44 72 L40 77 L36 72 L28 73 L26 65 L17 62 L20 56 L14 47 L20 43 L17 34 L24 31 L22 22 L29 21 L28 12 L33 13 Z"
                    fill="#5cb860" stroke="#0d1b2a" strokeWidth="1.7" strokeLinejoin="round"
                  />
                  <path d="M40 8 L40 46" stroke="#2f7d3a" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M40 22 L28 14 M40 22 L52 14 M40 32 L24 24 M40 32 L56 24" stroke="#2f7d3a" strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />
                  <path d="M30 17 Q34 27 33 38" stroke="#b5e8a4" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
                </g>
                {/* remera navy de Código Mate con cuello y franja ámbar */}
                <path
                  d="M23 50 Q27 46 33 46 Q40 50 47 46 Q53 46 57 50 L62 57 L56.5 60.5 L56 70 Q40 75 24 70 L23.5 60.5 L18 57 Z"
                  fill="#243349" stroke="#0d1b2a" strokeWidth="1.5" strokeLinejoin="round"
                />
                <path d="M33 46.3 Q40 51.5 47 46.3" stroke="#e9a23b" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M24.3 67.6 Q40 72.4 55.7 67.6" stroke="#e9a23b" strokeWidth="1.3" fill="none" opacity="0.9" />
                {/* cara */}
                <g className="yuyo__eyes">
                  <ellipse cx="33" cy="33" rx="2.8" ry="3.8" fill="#0d1b2a" />
                  <ellipse cx="47" cy="33" rx="2.8" ry="3.8" fill="#0d1b2a" />
                  <circle cx="34" cy="31.6" r="1" fill="#fff" />
                  <circle cx="48" cy="31.6" r="1" fill="#fff" />
                </g>
                <path className="yuyo__mouth" d="M35 40 Q40 45 45 40" stroke="#0d1b2a" strokeWidth="2" strokeLinecap="round" fill="none" />
                <ellipse cx="27" cy="39" rx="3.4" ry="2.1" fill="#e9a23b" opacity="0.55" />
                <ellipse cx="53" cy="39" rx="3.4" ry="2.1" fill="#e9a23b" opacity="0.55" />
                {/* mate torpedo con bombilla, sostenido con los dos brazos (mangas navy) */}
                <g className="yuyo__arm">
                  <g className="yuyo__steam" fill="none" stroke="#e0e1dd" strokeWidth="1.4" strokeLinecap="round">
                    <path d="M36 47 Q33 43 36 39 Q39 35 36 31" />
                    <path d="M42 46 Q39 42 42 38 Q45 34 42 30" />
                  </g>
                  <path d="M31 53 L53 53 L51 62 Q48 79 40 80 Q32 79 29 62 Z" fill="#b8742c" stroke="#0d1b2a" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M33 58 Q35 70 38 77" stroke="#e9a23b" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
                  <ellipse cx="42" cy="52.5" rx="11.5" ry="3.4" fill="#cfd6df" stroke="#0d1b2a" strokeWidth="1.2" />
                  <ellipse cx="42" cy="51.6" rx="9" ry="2.2" fill="#3d8a3e" />
                  <path d="M45 51 L55 30" stroke="#e0e1dd" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M54 32 L58 28" stroke="#e0e1dd" strokeWidth="3" strokeLinecap="round" />
                  <path d="M20 54 Q22 58 30 58.5" stroke="#243349" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <path d="M60 54 Q58 58 51 58.5" stroke="#243349" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <circle cx="31" cy="58.5" r="2.8" fill="#5cb860" stroke="#0d1b2a" strokeWidth="1.1" />
                  <circle cx="51" cy="58.5" r="2.8" fill="#5cb860" stroke="#0d1b2a" strokeWidth="1.1" />
                </g>
              </g>
            </svg>
          </button>
        </div>
        <span key={phrase} className="yuyo__hint" aria-hidden="true">
          {PHRASES[phrase]}
        </span>
      </div>

      <div className="yuyo__panel" role="dialog" aria-label="Chat con Yuyo" hidden={!open}>
        {loaded && <ChatWidget floating onClose={() => toggle(false)} />}
      </div>
    </div>
  );
}
