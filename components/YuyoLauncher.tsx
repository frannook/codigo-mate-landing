'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// El chat se descarga recién la primera vez que se abre: la mascota no suma peso a la carga de la página.
const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });

// Yuyo, una plantita que toma mate, camina por el borde inferior de la página. Con un clic se abre el chat en una burbuja
// en la esquina (como el asistente de cualquier sitio de empresa). No tapa nada: solo la mascota recibe clics.
export default function YuyoLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false); // una vez abierto queda montado: la charla no se pierde al cerrar
  const btnRef = useRef<HTMLButtonElement>(null);

  const toggle = (next: boolean) => {
    if (next) setLoaded(true);
    setOpen(next);
  };

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
    <div className="yuyo" data-open={open}>
      <div className="yuyo__walk">
        <div className="yuyo__flip">
          <button
            ref={btnRef}
            type="button"
            className="yuyo__btn"
            aria-label="Hablar con Yuyo, el agente de Código Mate"
            aria-expanded={open}
            onClick={() => toggle(!open)}
          >
            <svg viewBox="0 0 80 92" width="80" height="92" aria-hidden="true" focusable="false">
              {/* patitas */}
              <g className="yuyo__leg yuyo__leg--a">
                <rect x="30" y="74" width="5.5" height="12" rx="2.7" fill="#3a2418" />
                <ellipse cx="31.5" cy="87" rx="5.5" ry="2.6" fill="#2a1a11" />
              </g>
              <g className="yuyo__leg yuyo__leg--b">
                <rect x="44.5" y="74" width="5.5" height="12" rx="2.7" fill="#3a2418" />
                <ellipse cx="48.5" cy="87" rx="5.5" ry="2.6" fill="#2a1a11" />
              </g>
              <g className="yuyo__body">
                {/* hoja de yerba: borde aserrado, nervadura y venas */}
                <g className="yuyo__sprout">
                  <path
                    d="M40 3 L47 13 L52 12 L51 21 L58 22 L56 31 L63 34 L60 43 L66 47 L60 56 L63 62 L54 65 L52 73 L44 72 L40 77 L36 72 L28 73 L26 65 L17 62 L20 56 L14 47 L20 43 L17 34 L24 31 L22 22 L29 21 L28 12 L33 13 Z"
                    fill="#4fb23e" stroke="#2c7a2b" strokeWidth="1.6" strokeLinejoin="round"
                  />
                  <path d="M40 8 L40 70" stroke="#2c7a2b" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M40 22 L28 14 M40 22 L52 14 M40 32 L24 24 M40 32 L56 24 M40 44 L21 37 M40 44 L59 37" stroke="#2c7a2b" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
                  <path d="M30 18 Q34 30 33 42" stroke="#8be06f" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />
                </g>
                {/* cara */}
                <g className="yuyo__eyes">
                  <ellipse cx="33" cy="35" rx="2.8" ry="3.8" fill="#12261a" />
                  <ellipse cx="47" cy="35" rx="2.8" ry="3.8" fill="#12261a" />
                  <circle cx="34" cy="33.6" r="1" fill="#fff" />
                  <circle cx="48" cy="33.6" r="1" fill="#fff" />
                </g>
                <path d="M35 42 Q40 47 45 42" stroke="#12261a" strokeWidth="2" strokeLinecap="round" fill="none" />
                <ellipse cx="27" cy="41" rx="3.4" ry="2.1" fill="#f08a7a" opacity="0.7" />
                <ellipse cx="53" cy="41" rx="3.4" ry="2.1" fill="#f08a7a" opacity="0.7" />
                {/* mate torpedo con bombilla, sostenido con los dos brazos */}
                <g className="yuyo__arm">
                  <path d="M31 53 L53 53 L51 62 Q48 79 40 80 Q32 79 29 62 Z" fill="#9b5a26" stroke="#4a2810" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M33 58 Q35 70 38 77" stroke="#c98a4d" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
                  <ellipse cx="42" cy="52.5" rx="11.5" ry="3.4" fill="#b9bfc8" stroke="#4a2810" strokeWidth="1.2" />
                  <ellipse cx="42" cy="51.6" rx="9" ry="2.2" fill="#2f7d2b" />
                  <path d="M45 51 L55 30" stroke="#d5dbe3" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M54 32 L58 28" stroke="#d5dbe3" strokeWidth="3" strokeLinecap="round" />
                  <path d="M21 47 Q22 56 31 58" stroke="#3a2418" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <path d="M59 47 Q58 56 51 58" stroke="#3a2418" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <circle cx="31" cy="58" r="2.6" fill="#3a2418" />
                  <circle cx="51" cy="58" r="2.6" fill="#3a2418" />
                </g>
              </g>
            </svg>
          </button>
        </div>
        <span className="yuyo__hint" aria-hidden="true">¿Charlamos?</span>
      </div>

      <div className="yuyo__panel" role="dialog" aria-label="Chat con Yuyo" hidden={!open}>
        {loaded && <ChatWidget floating onClose={() => toggle(false)} />}
      </div>
    </div>
  );
}
