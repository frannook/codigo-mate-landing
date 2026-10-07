'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motionOn } from '@/lib/motion';
import { ArrowRight } from './icons';

// TODO: textos de ejemplo. Reemplazar por testimonios reales (con permiso) antes de publicar.
const ITEMS = [
  {
    quote: 'Antes me despertaba con veinte mensajes preguntando por el envío. Ahora llegan solo los que de verdad necesitan a una persona.',
    name: 'Valentina R.',
    role: 'Tienda de accesorios'
  },
  {
    quote: 'Lo que más me sorprendió fue el tono: contesta como lo haríamos nosotros. Nadie nota que es un agente hasta que se lo cuento.',
    name: 'Martín G.',
    role: 'Estudio contable'
  },
  {
    quote: 'En una llamada entendieron mi negocio. Una semana después ya estaba atendiendo clientes en la web, de noche y los domingos también.',
    name: 'Camila S.',
    role: 'Cursos online'
  },
  {
    quote: 'Cuando la consulta es compleja, me llega a WhatsApp con todo lo que ya conversaron. No tengo que preguntar nada de nuevo.',
    name: 'Joaquín P.',
    role: 'Servicio técnico'
  }
];

export default function Testimonials() {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((n: number) => {
    const el = track.current;
    if (!el) return;
    const next = (n + ITEMS.length) % ITEMS.length;
    const card = el.children[next] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: motionOn() ? 'smooth' : 'auto' });
    setI(next);
  }, []);

  // El índice sigue al scroll nativo (arrastre, trackpad, teclado).
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement;
    const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
    setI(Math.min(ITEMS.length - 1, Math.round(el.scrollLeft / step)));
  };

  useEffect(() => {
    if (paused || !motionOn()) return;
    const t = setTimeout(() => go(i + 1), 6500);
    return () => clearTimeout(t);
  }, [i, paused, go]);

  return (
    <div
      className="tcar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div ref={track} className="tcar__track" onScroll={onScroll} tabIndex={0} aria-label="Testimonios de clientes">
        {ITEMS.map((t, n) => (
          <figure key={t.name} className="tcard" aria-hidden={n !== i && undefined}>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <span aria-hidden="true" className="tcard__avatar">{t.name[0]}</span>
              <span className="tcard__who">
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="tcar__controls">
        <div className="tcar__dots" role="group" aria-label="Elegir testimonio">
          {ITEMS.map((t, n) => (
            <button key={t.name} type="button" className={`tcar__dot${n === i ? ' is-on' : ''}`} aria-label={`Testimonio ${n + 1}`} aria-current={n === i} onClick={() => go(n)} />
          ))}
        </div>
        <div className="tcar__arrows">
          <button type="button" aria-label="Anterior" onClick={() => go(i - 1)} style={{ transform: 'scaleX(-1)' }}>
            <ArrowRight />
          </button>
          <button type="button" aria-label="Siguiente" onClick={() => go(i + 1)}>
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
