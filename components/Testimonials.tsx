'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motionOn } from '@/lib/motion';

// TODO: textos de ejemplo. Reemplazar por testimonios reales (con permiso) antes de publicar.
type Item = { quote: string; name: string; role: string; chip: string };
const ITEMS: Item[] = [
  {
    quote: 'Antes me despertaba con veinte mensajes preguntando por el envío. Ahora llegan solo los que de verdad necesitan a una persona.',
    name: 'Valentina R.',
    role: 'Tienda de accesorios',
    chip: 'Menos mensajes repetidos'
  },
  {
    quote: 'Lo que más me sorprendió fue el tono: contesta como lo haríamos nosotros. Nadie nota que es un agente hasta que se lo cuento.',
    name: 'Martín G.',
    role: 'Estudio contable',
    chip: 'Habla como el estudio'
  },
  {
    quote: 'En una llamada entendieron mi negocio. Una semana después ya estaba atendiendo clientes en la web, de noche y los domingos también.',
    name: 'Camila S.',
    role: 'Cursos online',
    chip: 'Atiende también el domingo'
  },
  {
    quote: 'Cuando la consulta es compleja, me llega a WhatsApp con todo lo que ya conversaron. No tengo que preguntar nada de nuevo.',
    name: 'Joaquín P.',
    role: 'Servicio técnico',
    chip: 'Derivación con contexto'
  },
  {
    quote: 'Las consultas por una propiedad me llegan con zona, presupuesto y ganas de visitar. Yo solo confirmo el horario.',
    name: 'Lucía F.',
    role: 'Inmobiliaria',
    chip: 'Consultas ya filtradas'
  },
  {
    quote: 'Precios, cuidados previos, qué traer al turno: lo responde al toque. Las pacientes llegan con todo claro y nosotras atendemos tranquilas.',
    name: 'Florencia M.',
    role: 'Clínica estética',
    chip: 'Turnos sin dudas previas'
  },
  {
    quote: 'Seguimiento, zonas, horarios de retiro. Lo que antes era el teléfono sonando todo el día ahora se resuelve solo en el chat.',
    name: 'Diego A.',
    role: 'Courier',
    chip: 'Menos llamadas de seguimiento'
  },
  {
    quote: 'Reservas, platos sin TACC, si hay lugar el sábado. Contesta mientras nosotros estamos en plena cocina, sin cortar el servicio.',
    name: 'Sofía L.',
    role: 'Restaurante',
    chip: 'Reservas sin frenar la cocina'
  }
];

// Cada fila recorre los 8 en otro orden; sentido y velocidad (px/s) distintos. La tercera solo se ve en desktop (CSS).
const ROWS = [
  { order: [0, 1, 2, 3, 4, 5, 6, 7], speed: 34, dir: -1 },
  { order: [5, 2, 7, 0, 3, 6, 1, 4], speed: 26, dir: 1 },
  { order: [3, 6, 1, 4, 7, 2, 5, 0], speed: 42, dir: -1 }
];

const initials = (name: string) =>
  name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2);

function Card({ t }: { t: Item }) {
  return (
    <figure className="tm__card">
      <span className="tm__chip">{t.chip}</span>
      <blockquote className="tm__quote">{t.quote}</blockquote>
      <figcaption className="tm__who">
        <span className="tm__avatar" aria-hidden="true">
          {initials(t.name)}
        </span>
        <span className="tm__id">
          <strong>{t.name}</strong>
          <span>{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

type Row = { tw: gsap.core.Tween; dir: number; hover: boolean; drag: boolean };

// Desacelera hasta 0 (hover, arrastre o pausa) o vuelve a velocidad normal; nunca un corte seco.
const ramp = (r: Row, paused: boolean) => {
  const stop = paused || r.hover || r.drag;
  gsap.to(r.tw, { timeScale: stop ? 0 : 1, duration: r.drag ? 0.2 : stop ? 0.9 : 1.4, ease: 'power2.out', overwrite: true });
};

export default function Testimonials() {
  const root = useRef<HTMLDivElement>(null);
  const rows = useRef<Row[]>([]);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el || !motionOn()) return;
    const ac = new AbortController();
    const on = { signal: ac.signal };
    const wrap = gsap.utils.wrap(0, 1);

    rows.current = Array.from(el.querySelectorAll<HTMLElement>('.tm__row')).map((rowEl, i) => {
      const { speed, dir } = ROWS[i];
      const track = rowEl.firstElementChild as HTMLElement;
      // La pista son dos mitades idénticas: recorrer -50% cierra el loop sin salto.
      // ponytail: duración medida una vez; si cambia el ancho la velocidad varía un poco, el loop sigue limpio.
      const half = track.offsetWidth / 2 || 1600; // fila oculta en móvil: valor de respaldo
      const tw = gsap.fromTo(track, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: half / speed, ease: 'none', repeat: -1 });
      const r: Row = { tw, dir, hover: false, drag: false };
      const proxy = { d: 0 };
      let x0 = 0, p0 = 0, lastX = 0, lastT = 0, v = 0;

      rowEl.addEventListener('pointerenter', e => {
        if (e.pointerType !== 'mouse') return;
        r.hover = true;
        ramp(r, pausedRef.current);
      }, on);
      rowEl.addEventListener('pointerleave', e => {
        if (e.pointerType !== 'mouse') return;
        r.hover = false;
        ramp(r, pausedRef.current);
      }, on);

      rowEl.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        gsap.killTweensOf(proxy);
        r.drag = true;
        x0 = lastX = e.clientX;
        lastT = e.timeStamp;
        v = 0;
        p0 = tw.progress();
        rowEl.setPointerCapture(e.pointerId);
        rowEl.classList.add('is-drag');
        ramp(r, pausedRef.current);
      }, on);

      rowEl.addEventListener('pointermove', e => {
        // Brillo de borde: posición del cursor en la card como variables CSS.
        const card = (e.target as HTMLElement).closest<HTMLElement>('.tm__card');
        if (card && e.pointerType === 'mouse') {
          const b = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${e.clientX - b.left}px`);
          card.style.setProperty('--my', `${e.clientY - b.top}px`);
        }
        if (!r.drag) return;
        const w = track.offsetWidth / 2;
        tw.progress(wrap(p0 + (dir * (e.clientX - x0)) / w));
        const dt = e.timeStamp - lastT;
        if (dt > 0) v = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastT = e.timeStamp;
      }, on);

      const release = (e: PointerEvent) => {
        if (!r.drag) return;
        r.drag = false;
        rowEl.classList.remove('is-drag');
        if (rowEl.hasPointerCapture(e.pointerId)) rowEl.releasePointerCapture(e.pointerId);
        // Inercia: el gesto sigue un poco y frena con expo.
        const w = track.offsetWidth / 2;
        const base = tw.progress();
        proxy.d = 0;
        gsap.to(proxy, {
          d: gsap.utils.clamp(-600, 600, v * 320),
          duration: 0.9,
          ease: 'expo.out',
          onUpdate: () => void tw.progress(wrap(base + (dir * proxy.d) / w))
        });
        ramp(r, pausedRef.current);
      };
      rowEl.addEventListener('pointerup', release, on);
      rowEl.addEventListener('pointercancel', release, on);
      return r;
    });

    // Fuera de pantalla no se anima nada.
    const io = new IntersectionObserver(([en]) => rows.current.forEach(r => (en.isIntersecting ? r.tw.resume() : r.tw.pause())));
    io.observe(el);

    return () => {
      ac.abort();
      io.disconnect();
      rows.current.forEach(r => {
        gsap.killTweensOf(r.tw);
        r.tw.kill();
      });
      rows.current = [];
    };
  }, []);

  const toggle = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    rows.current.forEach(r => ramp(r, next));
  };

  return (
    <div ref={root} className="tm">
      {/* Lista real, una sola vez: visible como grilla si el movimiento está apagado, solo para lectores si está prendido. */}
      <ul className="tm__list" aria-label="Testimonios de clientes">
        {ITEMS.map(t => (
          <li key={t.name}>
            <Card t={t} />
          </li>
        ))}
      </ul>

      <div className="tm__rows" aria-hidden="true">
        {ROWS.map((row, i) => (
          <div key={i} className="tm__row">
            <div className="tm__track">
              {[0, 1].map(h => row.order.map(n => <Card key={`${h}-${n}`} t={ITEMS[n]} />))}
            </div>
          </div>
        ))}
      </div>

      <div className="tm__ctrl">
        <button type="button" className="tm__pause" aria-pressed={paused} onClick={toggle}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            {paused ? <path d="M4.5 2.8v10.4L13 8z" fill="currentColor" /> : <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />}
          </svg>
          Pausa
        </button>
      </div>
    </div>
  );
}
