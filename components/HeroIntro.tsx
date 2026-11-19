'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { motionOn } from '@/lib/motion';

// Entrada del hero en secuencia (solo escritorio, con JS y movimiento permitido):
// 1) el titular aparece desde lejos, palabra por palabra, en el centro;
// 2) se acomoda a la izquierda y aparece el subtítulo;
// 3) entran los dos botones;
// 4) desde la derecha entra el panel de demo, y ahí se avisa a HeroShowcase para que empiece (evento hero:panel-in).
// Si algo no corre, el panel arranca igual y el hero queda con su estado final (ver CSS intro-on en layout.tsx y extras.css).
export default function HeroIntro() {
  useEffect(() => {
    const html = document.documentElement;
    const root = document.querySelector<HTMLElement>('.hero');
    const panelIn = () => window.dispatchEvent(new Event('hero:panel-in'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 900px)').matches;

    if (!root || reduce || !wide || !motionOn()) {
      html.classList.remove('intro-on');
      html.dataset.heroOk = '1';
      panelIn();
      return;
    }

    const ctx = gsap.context(() => {
      const title = root.querySelector<HTMLElement>('.hero__title')!;
      const words = gsap.utils.toArray<HTMLElement>('.hero__word', title);
      const eyebrow = root.querySelector<HTMLElement>('.hero .eyebrow');
      const lead = root.querySelector<HTMLElement>('.hero__lead');
      const buttons = gsap.utils.toArray<HTMLElement>('.hero__ctas .btn');
      const visual = root.querySelector<HTMLElement>('.hero__visual');

      // Distancia del titular a su posición final: al empezar está centrado en la pantalla.
      const hr = root.getBoundingClientRect();
      const tr = title.getBoundingClientRect();
      const dx = hr.left + hr.width / 2 - (tr.left + tr.width / 2);

      gsap.set(title, { x: dx });
      gsap.set(words, { opacity: 0, z: -420, rotationX: -18, filter: 'blur(10px)', transformOrigin: '50% 100%' });

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      // 1) titular desde lejos, palabra por palabra
      tl.to(words, { opacity: 1, z: 0, rotationX: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.06 }, 0);
      if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.5);

      // 2) el titular se acomoda a la izquierda
      tl.to(title, { x: 0, duration: 0.8, ease: 'expo.inOut' }, 1.25);

      // 3) subtítulo y botones
      if (lead) tl.fromTo(lead, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 1.6);
      if (buttons.length) tl.fromTo(buttons, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 1.9);

      // 4) el panel de demo entra desde la derecha mientras el titular se acomoda
      if (visual) {
        tl.fromTo(
          visual,
          { opacity: 0, x: 140, rotationY: -14, transformPerspective: 1400 },
          { opacity: 1, x: 0, rotationY: -7, duration: 1.1, ease: 'expo.out' },
          1.4
        );
      }
      tl.call(panelIn, undefined, 1.4);

      html.classList.add('intro-live');
      html.dataset.heroOk = '1';
    }, root);

    return () => ctx.revert();
  }, []);

  return null;
}
