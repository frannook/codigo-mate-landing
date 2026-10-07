'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionOn } from '@/lib/motion';
import '@/app/styles/story.css';

// "Mientras dormís": una noche de un agente en cuatro momentos.
// Escritorio (≥ 900px): la sección se fija y el scroll avanza el reloj; a la derecha, un mismo celular muestra cada escena.
// Móvil: escenas apiladas con revelado al entrar. Sin movimiento: apiladas y visibles, sin JS de por medio.

// Posición de cada hora en la noche (23:00 → 09:30). El hueco largo entre 02:36 y 09:00 es el que dormís.
const TIMES = ['23:47', '01:12', '02:36', '09:00'];
const AT = [0.075, 0.21, 0.343, 0.952];

function Status({ time }: { time: string }) {
  return (
    <div className="ns__status" aria-hidden="true">
      <span>{time}</span>
    </div>
  );
}

function WebHead() {
  return (
    <div className="ns__app">
      <span className="ns__avatar" aria-hidden="true">
        T
      </span>
      <span className="ns__who">
        <strong>Asistente de tu tienda</strong>
        <small>En tu web · responde al instante</small>
      </span>
    </div>
  );
}

export default function NightStory() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !motionOn()) return;
    gsap.registerPlugin(ScrollTrigger);

    // matchMedia con scope: revierte animaciones, ScrollTriggers y estilos inline al desmontar o al cruzar 900px.
    const mm = gsap.matchMedia(el);
    const q = gsap.utils.selector(el);
    const copies = q('.ns__copy') as HTMLElement[];
    const screens = q('.ns__vis') as HTMLElement[];
    const steps = (s: Element) => s.querySelectorAll('[data-step]');
    const typeCode = {
      clipPath: 'inset(0 0% 0 0)',
      ease: 'steps(38)',
      duration: 1
    };

    // Escritorio: sección fijada, la noche avanza con el scroll.
    mm.add('(min-width: 900px)', () => {
      el.classList.add('is-pinned');
      const ticks = q('.ns__tick');
      gsap.set([...copies.slice(1), ...screens.slice(1)], { autoAlpha: 0 });
      gsap.set(ticks.slice(1), { opacity: 0.35, scale: 0.7 });
      gsap.set(q('.ns__fill'), { scaleX: AT[0] });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out', duration: 0.5 },
        scrollTrigger: {
          trigger: q('.ns__pin')[0],
          start: 'top top',
          end: () => `+=${window.innerHeight * 3.4}`,
          pin: true,
          scrub: 0.6,
          refreshPriority: 1,
          invalidateOnRefresh: true
        }
      });

      screens.forEach((screen, i) => {
        const t = i * 3;
        if (i) {
          tl.to(copies[i - 1], { autoAlpha: 0, y: -28 }, t)
            .to(screens[i - 1], { autoAlpha: 0, scale: 0.97, filter: 'blur(6px)' }, t)
            .fromTo(copies[i], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0 }, t + 0.35)
            .fromTo(screens[i], { autoAlpha: 0, scale: 1.03, filter: 'blur(6px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)' }, t + 0.35)
            .to(q('.ns__reel'), { yPercent: -25 * i, ease: 'power3.inOut', duration: 0.8 }, t)
            .to(q('.ns__fill'), { scaleX: AT[i], ease: 'power2.inOut', duration: 0.8 }, t)
            .to(ticks[i], { opacity: 1, scale: 1, duration: 0.3 }, t + 0.5);
        }
        tl.from(steps(screen), { autoAlpha: 0, y: 14, stagger: 0.45, duration: 0.4 }, t + (i ? 0.9 : 0.2));
        if (i === 1) tl.fromTo(q('.ns__vis .order__fill'), { scaleX: 0 }, { scaleX: 0.66, duration: 0.6 }, '>');
      });
      tl.from(q('.ns__install'), { autoAlpha: 0, y: 16 }, '>-0.2').fromTo(q('.ns__code-text'), { clipPath: 'inset(0 100% 0 0)' }, typeCode, '>');
      // El cielo aclara de a poco: de noche cerrada a la primera luz.
      tl.fromTo(q('.ns__dawn'), { opacity: 0 }, { opacity: 1, ease: 'power1.in', duration: tl.duration() }, 0)
        .to(q('.ns__stars'), { opacity: 0.15, ease: 'power1.in', duration: tl.duration() }, 0)
        .to({}, { duration: 0.8 });

      return () => el.classList.remove('is-pinned');
    });

    // Móvil: cada escena entra cuando aparece; los mensajes llegan en orden.
    mm.add('(max-width: 899px)', () => {
      q('.ns__scene').forEach((scene: HTMLElement, i: number) => {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', duration: 0.7 },
          scrollTrigger: { trigger: scene, start: 'top 78%', once: true }
        });
        tl.from(scene.querySelector('.ns__copy'), { autoAlpha: 0, y: 28 })
          .from(scene.querySelector('.ns__vis'), { autoAlpha: 0, y: 36 }, '<0.1')
          .from(steps(scene.querySelector('.ns__vis')!), { autoAlpha: 0, y: 12, stagger: 0.35, duration: 0.5 }, '<0.3');
        if (i === 1) tl.fromTo(scene.querySelector('.order__fill'), { scaleX: 0 }, { scaleX: 0.66, duration: 0.9 }, '>');
        if (i === 3)
          tl.from(scene.querySelector('.ns__install'), { autoAlpha: 0, y: 16 }, '<').fromTo(
            scene.querySelector('.ns__code-text'),
            { clipPath: 'inset(0 100% 0 0)' },
            typeCode,
            '>'
          );
      });
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="ns" aria-labelledby="ns-title">
      <div className="wrap ns__head" data-reveal="up">
        <h2 id="ns-title" className="h2" data-headline>
          Mientras dormís, <em className="accent">tu web sigue atendiendo</em>.
        </h2>
        <p className="ns__lead">Una noche cualquiera de tu agente, en cuatro momentos.</p>
      </div>

      <div className="ns__pin">
        <div className="ns__sky" aria-hidden="true">
          <div className="ns__stars" />
          <div className="ns__dawn" />
        </div>

        <div className="wrap ns__stage">
          <div className="ns__clock" aria-hidden="true">
            <div className="ns__digits">
              <div className="ns__reel">
                {TIMES.map(t => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="ns__night">
              <div className="ns__fill" />
              {AT.map(x => (
                <span key={x} className="ns__tick" style={{ left: `${x * 100}%` }} />
              ))}
            </div>
            <div className="ns__ends">
              <span>Noche</span>
              <span>Mañana</span>
            </div>
          </div>

          <div className="ns__device glass" aria-hidden="true" />

          {/* 1 — Atiende a cualquier hora */}
          <div className="ns__scene">
            <div className="ns__copy">
              <p className="ns__when">
                <time>23:47</time> Tu local ya cerró.
              </p>
              <h3>Atiende a cualquier hora</h3>
              <p>Una clienta quiere cambiar un talle. El agente le contesta al instante, con la política de tu negocio y en tu tono.</p>
            </div>
            <div className="ns__vis">
              <Status time="23:47" />
              <WebHead />
              <div className="ns__log">
                <p className="bubble-user" data-step>
                  Hola! Compré una remera y me quedó chica. ¿La puedo cambiar?
                </p>
                <p className="bubble-bot" data-step>
                  ¡Sí! Tenés 30 días para cambiarla, con la etiqueta puesta. ¿Querés que te diga cómo hacerlo?
                </p>
                <p className="bubble-user" data-step>
                  Dale, gracias!
                </p>
              </div>
            </div>
          </div>

          {/* 2 — Resuelve */}
          <div className="ns__scene">
            <div className="ns__copy">
              <p className="ns__when">
                <time>01:12</time> Alguien no se duerme sin saber de su compra.
              </p>
              <h3>Resuelve, no solo contesta</h3>
              <p>Busca el pedido, muestra en qué etapa está y cierra la duda en la misma charla. Nadie tiene que esperar a mañana.</p>
            </div>
            <div className="ns__vis">
              <Status time="01:12" />
              <WebHead />
              <div className="ns__log">
                <p className="bubble-user" data-step>
                  ¿Cuándo me llega el pedido 4790?
                </p>
                <div className="bubble-bot ns__bot" data-step>
                  <span>Ya salió del depósito. Te llega mañana.</span>
                  <div className="order">
                    <div className="order__top">
                      <span className="order__id">#4790</span>
                      <span className="order__status">En camino</span>
                    </div>
                    <div className="order__track">
                      <div className="order__fill" />
                    </div>
                    <div className="order__steps">
                      <span>Preparado</span>
                      <span>En camino</span>
                      <span>Entregado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 — Pase a WhatsApp con contexto */}
          <div className="ns__scene">
            <div className="ns__copy">
              <p className="ns__when">
                <time>02:36</time> Un caso que necesita a alguien de tu equipo.
              </p>
              <h3>Te pasa lo que necesita una persona</h3>
              <p>El agente se da cuenta, arma un resumen y te lo manda a WhatsApp. Con todo el contexto, para que nadie repita nada.</p>
            </div>
            <div className="ns__vis">
              <Status time="02:36" />
              <WebHead />
              <div className="ns__log">
                <p className="bubble-user" data-step>
                  Puse mal la dirección del pedido 4821 y ya está en camino. ¿Se puede cambiar?
                </p>
                <p className="bubble-bot" data-step>
                  Eso lo tiene que ver alguien del equipo. Ya les pasé tu caso con todos los datos.
                </p>
                <span className="handoff" data-step>
                  Caso enviado a WhatsApp
                </span>
              </div>
              <div className="wa ns__notif" data-step>
                <span className="wa__icon" aria-hidden="true">
                  W
                </span>
                <span className="wa__text">
                  <span className="wa__title">WhatsApp · Agente de tu web</span>
                  <span className="wa__sub">Lucía, pedido #4821, pide cambiar la dirección de entrega…</span>
                </span>
              </div>
            </div>
          </div>

          {/* 4 — A la mañana + instalación */}
          <div className="ns__scene">
            <div className="ns__copy">
              <p className="ns__when">
                <time>09:00</time> Te levantás.
              </p>
              <h3>Abrís WhatsApp y está todo listo</h3>
              <p>El resumen te espera: quién es, qué pedido y qué necesita. Respondés vos, sin arrancar de cero.</p>
              <div className="ns__install">
                <p className="ns__punch">Y para tenerlo, una línea de código.</p>
                <code className="ns__code">
                  <span className="ns__code-text">&lt;script src=&quot;codigomate.js&quot;&gt;&lt;/script&gt;</span>
                  <span className="ns__caret" aria-hidden="true" />
                </code>
                <p className="ns__small">Funciona en cualquier plataforma: tienda, sitio a medida o landing. La instalación la hacemos nosotros.</p>
              </div>
            </div>
            <div className="ns__vis">
              <Status time="09:00" />
              <div className="ns__app ns__app--wa">
                <span className="ns__avatar" aria-hidden="true">
                  A
                </span>
                <span className="ns__who">
                  <strong>Agente de tu web</strong>
                  <small>WhatsApp</small>
                </span>
              </div>
              <div className="ns__log">
                <div className="bubble-bot ns__summary" data-step>
                  <strong>Resumen del caso · 02:36</strong>
                  <span>Lucía · pedido #4821 (en camino)</span>
                  <span>Cargó mal la dirección de entrega y quiere cambiarla. Ya le avisé que la contacta alguien del equipo.</span>
                </div>
                <p className="bubble-user" data-step>
                  Gracias. Le escribo ahora y lo arreglo con el correo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
