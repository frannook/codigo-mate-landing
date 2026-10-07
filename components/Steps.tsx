'use client';

import { useEffect, useRef, useState } from 'react';
import { motionOn } from '@/lib/motion';

// Línea de tiempo de "Cómo trabajamos". Las animaciones quedan pausadas hasta que la sección se ve.
export default function Steps() {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionOn() || !('IntersectionObserver' in window)) {
      setPlaying(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setPlaying(true);
        io.disconnect();
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const d = (s: number) => ({ animationDelay: `${s}s` });

  return (
    <div ref={ref} className={`steps${playing ? ' is-playing' : ''}`}>
      <div aria-hidden="true" className="steps__line only-wide">
        <div className="anim" />
      </div>
      <ol>
        <li data-reveal="left" className="step">
          <span aria-hidden="true" className="step__node anim" style={d(0.2)} />
          <span className="step__num">01</span>
          <div aria-hidden="true" className="step__card">
            <div className="q-bubble anim">¿Qué te preguntan tus clientes?</div>
            <div className="tags">
              {['Horario', 'Precios', 'Políticas', 'Preguntas frecuentes'].map((t, i) => (
                <span key={t} className="tag anim" style={d(0.85 + i * 0.14)}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <h3>Entendemos tu negocio</h3>
          <p>Una llamada para conocer qué te preguntan tus clientes, tu horario, tus precios y tus políticas.</p>
        </li>

        <li data-reveal="up" className="step">
          <span aria-hidden="true" className="step__node anim" style={d(1.25)} />
          <span className="step__num">02</span>
          <div aria-hidden="true" className="step__card step__card--center">
            {[
              ['Tu información', 1.4, false],
              ['Tu tono de voz', 1.7, false],
              ['Conversaciones reales', 2.0, true]
            ].map(([label, delay, hi]) => (
              <div key={label as string} className="bar">
                <span className="bar__label">{label}</span>
                <div className="bar__track">
                  <div className={`bar__fill anim${hi ? ' bar__fill--hi' : ''}`} style={d(delay as number)} />
                </div>
              </div>
            ))}
          </div>
          <h3>Entrenamos al agente</h3>
          <p>Lo armamos con tu información y tu tono de voz, y lo probamos con conversaciones reales antes de publicarlo.</p>
        </li>

        <li data-reveal="right" className="step">
          <span aria-hidden="true" className="step__node anim" style={d(1.85)} />
          <span className="step__num">03</span>
          <div aria-hidden="true" className="step__card step__card--clip">
            <div className="code">
              <span className="code__text anim">&lt;script src=&quot;codigomate.js&quot;&gt;&lt;/script&gt;</span>
              <span className="code__caret" />
            </div>
            <div className="wa anim">
              <span className="wa__icon">W</span>
              <span className="wa__text">
                <span className="wa__title">Nueva consulta en WhatsApp</span>
                <span className="wa__sub">Con todo el contexto de la charla</span>
              </span>
            </div>
          </div>
          <h3>Lo instalamos en tu web</h3>
          <p>Una línea de código en tu sitio y queda activo. Las consultas que necesitan una persona llegan a tu WhatsApp.</p>
        </li>
      </ol>
    </div>
  );
}
