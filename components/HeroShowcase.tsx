'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motionOn } from '@/lib/motion';
import { ArrowRight, ArrowUp } from './icons';
import '@/app/styles/showcase.css';

// Vitrina del hero: 6 conversaciones de rubros distintos que se reproducen en loop con un timeline maestro de GSAP.
// Los negocios, precios y datos son de ejemplo (ficticios).

type Card =
  | { type: 'order'; id: string; status: string; step: number }
  | { type: 'slots'; times: string[]; pick: number }
  | { type: 'confirm'; title: string; lines: string[] }
  | { type: 'product'; name: string; meta: string; price: string; cta: string }
  | { type: 'property'; title: string; meta: string; price: string }
  | { type: 'chip'; text: string }
  | { type: 'handoff'; human: string; summary?: string };

type Step = { who: 'user' | 'bot'; text: string; card?: Card };
type Scene = { tab: string; url: string; business: string; steps: Step[] };

const SCENES: Scene[] = [
  {
    tab: 'Logística',
    url: 'rapidoenvios.com.ar/seguimiento',
    business: 'Rápido Envíos',
    steps: [
      { who: 'user', text: '¿Dónde está mi paquete? Es el #4821' },
      {
        who: 'bot',
        text: 'Ya está en tu ciudad: sale a reparto hoy y llega antes de las 18 h.',
        card: { type: 'order', id: '4821', status: 'En reparto', step: 2 }
      },
      { who: 'user', text: '¿Lo puede recibir mi vecino?' },
      { who: 'bot', text: 'Sí. Autorizalo desde acá y le avisamos al repartidor.', card: { type: 'chip', text: 'Autorizar a otra persona' } }
    ]
  },
  {
    tab: 'Turnos',
    url: 'esteticaluz.com.ar/turnos',
    business: 'Estética Luz',
    steps: [
      { who: 'user', text: 'Quiero un turno para limpieza facial esta semana' },
      { who: 'bot', text: 'Tengo estos horarios libres:', card: { type: 'slots', times: ['Jue 10:00', 'Jue 16:30', 'Vie 11:00'], pick: 1 } },
      { who: 'user', text: 'Jueves 16:30' },
      {
        who: 'bot',
        text: '¡Listo! Te llega el recordatorio por WhatsApp el día anterior.',
        card: { type: 'confirm', title: 'Turno reservado', lines: ['Limpieza facial', 'Jueves 16:30 h'] }
      }
    ]
  },
  {
    tab: 'Tienda online',
    url: 'nomade.store/camperas',
    business: 'Tienda Nómade',
    steps: [
      { who: 'user', text: '¿Tienen la campera Andes en talle M?' },
      {
        who: 'bot',
        text: 'Sí, quedan 3 en talle M.',
        card: { type: 'product', name: 'Campera Andes', meta: 'Talle M · Verde oliva', price: '$89.900', cta: 'Agregar al carrito' }
      },
      { who: 'user', text: '¿Cuánto me sale el envío a Córdoba?' },
      { who: 'bot', text: 'Nada: tu compra supera $60.000, así que el envío es gratis. Llega en 3 a 5 días.', card: { type: 'chip', text: 'Envío gratis · 3 a 5 días' } }
    ]
  },
  {
    tab: 'Inmobiliaria',
    url: 'costaprop.com.ar/alquileres',
    business: 'Costa Propiedades',
    steps: [
      { who: 'user', text: '¿Cuánto sale el 2 ambientes de Palermo?' },
      {
        who: 'bot',
        text: 'El alquiler es de $650.000 por mes, más expensas. ¿Querés verlo?',
        card: { type: 'property', title: '2 ambientes con balcón', meta: 'Palermo Soho · 48 m²', price: '$650.000/mes' }
      },
      { who: 'user', text: 'Sí, el sábado a la mañana' },
      { who: 'bot', text: 'Te propongo el sábado 10:30. Martín te lo confirma por WhatsApp.', card: { type: 'handoff', human: 'Martín' } }
    ]
  },
  {
    tab: 'Gastronomía',
    url: 'labodegadelpuerto.com.ar/reservas',
    business: 'La Bodega del Puerto',
    steps: [
      { who: 'user', text: '¿Tienen mesa para 4 el sábado a las 21?' },
      { who: 'bot', text: '¡Sí! Te queda una mesa en la galería. ¿A nombre de quién?' },
      { who: 'user', text: 'Sofía' },
      { who: 'bot', text: 'Hecho, Sofía. Te esperamos.', card: { type: 'confirm', title: 'Reserva confirmada', lines: ['Sábado 21 h · 4 personas', 'Mesa en la galería'] } }
    ]
  },
  {
    tab: 'Servicios',
    url: 'estudiorm.com.ar/contacto',
    business: 'Estudio RM Contable',
    steps: [
      { who: 'user', text: 'Me llegó una intimación de ARCA, ¿me pueden ayudar?' },
      {
        who: 'bot',
        text: 'Para eso te paso con Martina, que lleva tu cuenta. Ya le dejé el resumen.',
        card: { type: 'handoff', human: 'Martina', summary: 'Cliente con intimación de ARCA. Pide asesoramiento hoy.' }
      }
    ]
  }
];

const ORDER_STEPS = ['Preparado', 'En reparto', 'Entregado'];

function CardView({ c }: { c: Card }) {
  switch (c.type) {
    case 'order':
      return (
        <div className="order sc__card">
          <div className="order__top">
            <span className="order__id">Envío #{c.id}</span>
            <span className="order__status">{c.status}</span>
          </div>
          <div className="order__track">
            <div className="order__fill sc__fill" style={{ transform: `scaleX(${c.step / 3})` }} />
          </div>
          <div className="order__steps">
            {ORDER_STEPS.map(s => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      );
    case 'slots':
      return (
        <div className="sc__slots sc__card">
          {c.times.map((t, i) => (
            <span key={t} className="sc__slot" data-pick={i === c.pick ? '' : undefined}>
              {t}
            </span>
          ))}
        </div>
      );
    case 'confirm':
      return (
        <div className="sc__confirm sc__card">
          <span className="sc__check" aria-hidden="true">
            ✓
          </span>
          <span>
            <strong>{c.title}</strong>
            {c.lines.map(l => (
              <small key={l}>{l}</small>
            ))}
          </span>
        </div>
      );
    case 'product':
      return (
        <div className="sc__product sc__card">
          <span className="sc__thumb" aria-hidden="true" />
          <span className="sc__pinfo">
            <strong>{c.name}</strong>
            <small>{c.meta}</small>
            <b>{c.price}</b>
          </span>
          <span className="sc__cta">{c.cta}</span>
        </div>
      );
    case 'property':
      return (
        <div className="sc__property sc__card">
          <span className="sc__photo" aria-hidden="true" />
          <span className="sc__pinfo">
            <strong>{c.title}</strong>
            <small>{c.meta}</small>
            <b>{c.price}</b>
          </span>
        </div>
      );
    case 'chip':
      return <span className="sc__chip sc__card">{c.text}</span>;
    case 'handoff':
      return (
        <div className="sc__handoff sc__card">
          <span className="handoff">
            Continuar en WhatsApp con {c.human} <ArrowRight size={14} />
          </span>
          {c.summary && <small>Resumen para {c.human}: {c.summary}</small>}
        </div>
      );
  }
}

export default function HeroShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const master = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el || !motionOn()) return;

    const ctx = gsap.context(() => {
      const url = el.querySelector<HTMLElement>('.sc__url')!;
      const field = el.querySelector<HTMLElement>('.sc__field')!;
      const scenes = gsap.utils.toArray<HTMLElement>('.sc__scene', el);
      const bars = gsap.utils.toArray<HTMLElement>('.sc__bar', el);

      // Escribe un texto letra por letra en un elemento.
      const type = (target: HTMLElement, text: string, speed: number) => {
        const p = { n: 0 };
        return gsap.to(p, {
          n: text.length,
          duration: text.length * speed,
          ease: 'none',
          onUpdate: () => void (target.textContent = text.slice(0, Math.round(p.n))),
          onReverseComplete: () => void (target.textContent = '')
        });
      };

      const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'expo.out', duration: 0.5 } });

      scenes.forEach((scene, i) => {
        const s = gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.5 } });
        const steps = gsap.utils.toArray<HTMLElement>('.sc__step', scene);
        s.call(() => setActive(i))
          .set(scenes, { display: 'none' })
          .set(steps, { display: 'none' })
          .set(scene, { display: 'flex' })
          .call(() => void (field.textContent = ''))
          .add(type(url, SCENES[i].url, 0.022))
          .fromTo(scene, { autoAlpha: 0, y: 14, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7 }, '<');

        steps.forEach(step => {
          if (step.dataset.who === 'user') {
            s.add(type(field, step.dataset.text || '', 0.032), '+=0.35')
              .call(() => void (field.textContent = ''), undefined, '+=0.25')
              .set(step, { display: 'flex' })
              .fromTo(step, { autoAlpha: 0, y: 22, scale: 0.94, transformOrigin: '100% 100%' }, { autoAlpha: 1, y: 0, scale: 1 }, '<');
          } else {
            const dots = step.querySelector('.typing')!;
            const msg = step.querySelector('.sc__bot')!;
            const card = step.querySelector('.sc__card');
            s.set(step, { display: 'flex' }, '+=0.3')
              .set(msg, { display: 'none' })
              .set(dots, { display: 'flex' })
              .fromTo(dots, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 })
              .set(dots, { display: 'none' }, '+=0.85')
              .set(msg, { display: 'flex' })
              .fromTo(msg, { autoAlpha: 0, y: 16, scale: 0.96, transformOrigin: '0% 100%' }, { autoAlpha: 1, y: 0, scale: 1 });
            if (card) {
              s.fromTo(card, { autoAlpha: 0, y: 14, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6 }, '-=0.2');
              const fill = card.querySelector('.sc__fill');
              if (fill) s.fromTo(fill, { scaleX: 0 }, { scaleX: 2 / 3, duration: 1.2, ease: 'power3.inOut' }, '<0.1');
              const slots = card.querySelectorAll('.sc__slot');
              if (slots.length) s.from(slots, { autoAlpha: 0, y: 8, stagger: 0.08, duration: 0.4 }, '<');
              const pick = card.querySelector('.sc__slot[data-pick]');
              if (pick) s.fromTo(pick, { backgroundColor: 'rgba(224, 225, 221, 0)', borderColor: '#415a77', color: '#afbbcb' }, { backgroundColor: '#e0e1dd', borderColor: '#e0e1dd', color: '#0d1b2a', duration: 0.35, ease: 'power2.out' }, '+=0.6');
              const check = card.querySelector('.sc__check');
              if (check) s.from(check, { scale: 0, rotate: -40, duration: 0.6, ease: 'back.out(2)' }, '<0.15');
            }
          }
          s.to({}, { duration: 0.9 });
        });

        s.to(scene, { autoAlpha: 0, y: -12, filter: 'blur(8px)', duration: 0.5, ease: 'power2.in' }, '+=1.6').set(scene, { display: 'none' });

        tl.addLabel(`s${i}`);
        tl.add(s, `s${i}`);
        tl.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: s.duration(), ease: 'none' }, `s${i}`);
        tl.set(bars[i], { scaleX: 0 });
      });

      master.current = tl;
    }, el);

    // Fuera de pantalla o con la pestaña oculta, no corre.
    let visible = true;
    const sync = () => (visible && !document.hidden ? master.current?.resume() : master.current?.pause());
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      ctx.revert();
      master.current = null;
    };
  }, []);

  const jump = (i: number) => {
    setActive(i);
    master.current?.play(`s${i}`);
  };

  return (
    <div ref={root} className="demo sc">
      <div className="browser" aria-hidden="true">
        <div className="browser__bar">
          <span className="browser__dot" />
          <span className="browser__dot" />
          <span className="browser__dot" />
          <div className="browser__url">
            <span className="sc__url">{SCENES[0].url}</span>
          </div>
        </div>
        <div className="browser__body">
          <div className="browser__skeleton">
            <div />
            <div />
            <div />
            <div />
          </div>
          <div className="chat sc__chat">
            <div className="sc__scenes">
              {SCENES.map((sc, i) => (
                <div key={sc.tab} className="sc__scene" hidden={i !== active}>
                  <div className="chat__head">
                    <div className="avatar">{sc.business[0]}</div>
                    <div className="chat__who">
                      <span className="chat__name">{sc.business}</span>
                      <span className="chat__state">Asistente · responde al instante</span>
                    </div>
                  </div>
                  <div className="sc__log">
                    {sc.steps.map((st, j) =>
                      st.who === 'user' ? (
                        <div key={j} className="sc__step bubble-user" data-who="user" data-text={st.text}>
                          {st.text}
                        </div>
                      ) : (
                        <div key={j} className="sc__step sc__botstep" data-who="bot">
                          <div className="typing">
                            <span />
                            <span />
                            <span />
                          </div>
                          <div className="sc__bot msg-bot">
                            <div className="bubble-bot">{st.text}</div>
                            {st.card && <CardView c={st.card} />}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="sc__composer">
              <span className="sc__field" />
              <span className="sc__placeholder">Escribí tu consulta…</span>
              <span className="sc__send">
                <ArrowUp />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="sc__tabs" role="group" aria-label="Ejemplos de conversaciones por rubro">
        {SCENES.map((sc, i) => (
          <button key={sc.tab} type="button" className="sc__tab" aria-pressed={active === i} onClick={() => jump(i)}>
            <span>{sc.tab}</span>
            <i className="sc__bar" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
