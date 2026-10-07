'use client';

import { useEffect } from 'react';

// Hace entrar cada bloque con data-reveal (left | right | up) cuando aparece en pantalla.
// El estado oculto inicial lo pone CSS bajo html.reveal-on, así no hay parpadeo.
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('reveal-on')) return;
    root.classList.add('reveal-live');
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          // También revela lo que quedó por encima del viewport (ancla o recarga con scroll).
          if (!e.isIntersecting && e.boundingClientRect.top > 0) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }),
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${(i % 3) * 0.1}s`);
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
