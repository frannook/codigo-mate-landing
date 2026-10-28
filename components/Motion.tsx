'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { isLite, motionOn, whenNear } from '@/lib/motion';

// Capa de movimiento: scroll suave (Lenis), barra de progreso, paralaje, titulares palabra por palabra,
// cinta que reacciona a la velocidad del scroll y botones magnéticos.
// Si el movimiento está apagado (interruptor o sistema) no se arma nada y la página se ve completa.
export default function Motion() {
  useEffect(() => {
    if (!motionOn()) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Scroll suave solo con mouse: en pantallas táctiles el scroll nativo ya es fluido y Lenis no aporta.
    const lite = isLite();
    const lenis = lite ? null : new Lenis({ lerp: 0.09, anchors: true }); // el alto del nav sale de scroll-padding-top (html), igual que sin Lenis
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const stops: Array<() => void> = [];

    // Celulares: la barra de progreso sigue el scroll con un listener simple; sin ScrollTrigger ni paralaje.
    if (lite) {
      const bar = document.querySelector<HTMLElement>('.progress');
      let raf = 0;
      const update = () => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      };
      const onScroll = () => void (raf ||= requestAnimationFrame(update));
      window.addEventListener('scroll', onScroll, { passive: true });
      stops.push(() => {
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(raf);
      });
    }

    const ctx = gsap.context(() => {
      if (!lite) {
        gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

        // Entrada de cada sección: llega apenas inclinada hacia atrás y se apoya plana mientras sube (el cotizador queda quieto).
        gsap.utils.toArray<HTMLElement>('.section:not(.qt) > .section__inner').forEach(el =>
          gsap.fromTo(
            el,
            { rotateX: 7, y: 60, transformPerspective: 1400, transformOrigin: '50% 0%' },
            { rotateX: 0, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 45%', scrub: 0.6 } }
          )
        );

        const top = { trigger: '.top', start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.top__glow', { yPercent: 30, ease: 'none', scrollTrigger: top });
        if (document.querySelector('.hero__visual')) {
          gsap.to('.hero__visual', { yPercent: -7, ease: 'none', scrollTrigger: top });
          gsap.to('.hero__copy', { yPercent: 8, opacity: 0.35, ease: 'none', scrollTrigger: top });
        }
      }

      // Titulares: cada palabra sube desde una máscara, con desenfoque que se aclara.
      // Se arman recién cuando cada titular está por entrar: no se parte ni se mide ninguno de entrada.
      gsap.utils.toArray<HTMLElement>('[data-headline]').forEach(el => {
        stops.push(
          whenNear(
            el,
            () =>
              ctx.add(() => {
                const split = SplitText.create(el, { type: 'words', mask: 'words', aria: 'auto' });
                gsap.from(split.words, {
                  yPercent: 110,
                  rotate: 4,
                  opacity: 0,
                  ...(lite ? null : { filter: 'blur(8px)' }),
                  duration: 1.1,
                  ease: 'expo.out',
                  stagger: 0.07,
                  // Con mouse espera al 88% de la pantalla; en celulares arranca apenas está por entrar.
                  ...(lite ? null : { scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
                });
              }),
            lite ? '-60px' : '200px'
          )
        );
      });

      // Cinta: corre sola y se acelera (y cambia de sentido) con el scroll.
      // En celulares queda la animación CSS de siempre (corre sin JS) y no se arma el efecto de velocidad.
      const track = lite ? null : document.querySelector<HTMLElement>('.strip__track');
      if (track) {
        track.classList.add('is-js');
        const loop = gsap.to(track, { xPercent: -50, duration: 42, ease: 'none', repeat: -1 });
        ScrollTrigger.create({
          trigger: '.strip',
          onUpdate: self => {
            const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 260);
            gsap.to(loop, { timeScale: v === 0 ? 1 : 1 + Math.abs(v), duration: 0.3, overwrite: true });
            gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3, overwrite: 'auto' });
          }
        });
      }

      // Botones magnéticos (solo con mouse).
      if (!lite) gsap.utils.toArray<HTMLElement>('.btn--solid, .nav__cta').forEach(el => {
        const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
        const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
        el.addEventListener('pointermove', e => {
          const r = el.getBoundingClientRect();
          x((e.clientX - r.left - r.width / 2) * 0.18);
          y((e.clientY - r.top - r.height / 2) * 0.28);
        });
        el.addEventListener('pointerleave', () => {
          x(0);
          y(0);
        });
      });
    });

    return () => {
      stops.forEach(f => f());
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return <div aria-hidden="true" className="progress" />;
}
