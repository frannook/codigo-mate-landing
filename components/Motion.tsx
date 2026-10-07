'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { motionOn } from '@/lib/motion';

// Capa de movimiento: scroll suave (Lenis), barra de progreso, paralaje, titulares palabra por palabra,
// cinta que reacciona a la velocidad del scroll y botones magnéticos.
// Si el movimiento está apagado (interruptor o sistema) no se arma nada y la página se ve completa.
export default function Motion() {
  useEffect(() => {
    if (!motionOn()) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const lenis = new Lenis({ lerp: 0.09, anchors: true }) // el alto del nav sale de scroll-padding-top (html), igual que sin Lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

      const top = { trigger: '.top', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.top__glow', { yPercent: 30, ease: 'none', scrollTrigger: top });
      gsap.to('.hero__visual', { yPercent: -7, ease: 'none', scrollTrigger: top });
      gsap.to('.hero__copy', { yPercent: 8, opacity: 0.35, ease: 'none', scrollTrigger: top });

      // Titulares: cada palabra sube desde una máscara, con desenfoque que se aclara.
      gsap.utils.toArray<HTMLElement>('[data-headline]').forEach(el => {
        const split = SplitText.create(el, { type: 'words', mask: 'words', aria: 'auto' });
        gsap.from(split.words, {
          yPercent: 110,
          rotate: 4,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });

      // Cinta: corre sola y se acelera (y cambia de sentido) con el scroll.
      const track = document.querySelector<HTMLElement>('.strip__track');
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

      // Botones magnéticos.
      gsap.utils.toArray<HTMLElement>('.btn--solid, .nav__cta').forEach(el => {
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
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <div aria-hidden="true" className="progress" />;
}
