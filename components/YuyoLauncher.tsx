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
                <rect x="30" y="68" width="7" height="16" rx="3.5" fill="#2f7a3a" />
                <ellipse cx="34" cy="85" rx="7" ry="3.4" fill="#2a6a33" />
              </g>
              <g className="yuyo__leg yuyo__leg--b">
                <rect x="44" y="68" width="7" height="16" rx="3.5" fill="#2f7a3a" />
                <ellipse cx="48" cy="85" rx="7" ry="3.4" fill="#2a6a33" />
              </g>
              <g className="yuyo__body">
                {/* hojas del brote */}
                <g className="yuyo__sprout">
                  <path d="M40 24 C34 10 22 8 14 12 C16 22 26 28 40 26 Z" fill="#7bd36a" />
                  <path d="M40 24 C46 8 58 4 67 9 C65 20 54 27 40 26 Z" fill="#5cb85c" />
                  <path d="M40 26 C40 18 40 12 41 5" stroke="#2f7a3a" strokeWidth="3" strokeLinecap="round" fill="none" />
                </g>
                {/* cuerpo */}
                <ellipse cx="40" cy="48" rx="23" ry="24" fill="#6bc65d" />
                <ellipse cx="33" cy="38" rx="9" ry="6" fill="#92e07f" opacity="0.55" />
                {/* cara */}
                <g className="yuyo__eyes">
                  <ellipse cx="32" cy="46" rx="3.2" ry="4.2" fill="#12261a" />
                  <ellipse cx="46" cy="46" rx="3.2" ry="4.2" fill="#12261a" />
                  <circle cx="33" cy="44.5" r="1.1" fill="#fff" />
                  <circle cx="47" cy="44.5" r="1.1" fill="#fff" />
                </g>
                <path d="M34 55 Q39 60 44 55" stroke="#12261a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <ellipse cx="26" cy="54" rx="3.6" ry="2.2" fill="#e9a23b" opacity="0.5" />
                <ellipse cx="52" cy="54" rx="3.6" ry="2.2" fill="#e9a23b" opacity="0.5" />
                {/* brazo con el mate */}
                <g className="yuyo__arm">
                  <path d="M60 56 Q68 58 68 64" stroke="#5cb85c" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  <path d="M60 64 L76 64 L74 78 Q68 83 62 78 Z" fill="#9a6232" />
                  <rect x="59" y="62" width="18" height="4" rx="2" fill="#e9a23b" />
                  <path d="M72 64 L77 46" stroke="#cfd6df" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="77.5" cy="45" r="2" fill="#cfd6df" />
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
