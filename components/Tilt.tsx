'use client';

import { useEffect } from 'react';
import { isLite } from '@/lib/motion';

// Inclinación 3D hacia el cursor para todo lo que tenga [data-tilt] (solo con mouse; en celulares queda quieto).
// Escribe --rx/--ry/--mx/--my y el CSS (glass.css) arma el giro y el brillo. Un listener por página, delegado.
export default function Tilt() {
  useEffect(() => {
    if (isLite()) return;
    let cur: HTMLElement | null = null;
    let raf = 0;
    let ev: PointerEvent | null = null;
    const reset = (el: HTMLElement) => {
      // Vuelve a la pose del CSS (algunas tarjetas arrancan apenas giradas).
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
      el.removeAttribute('data-tilting');
    };
    const paint = () => {
      raf = 0;
      if (!ev) return;
      const el = (ev.target as Element | null)?.closest?.<HTMLElement>('[data-tilt]') ?? null;
      if (cur && cur !== el) reset(cur);
      cur = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      const max = Number(el.dataset.tilt) || 6;
      el.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-y * max * 1.6).toFixed(2)}deg`);
      el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
      el.setAttribute('data-tilting', '');
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      ev = e;
      raf ||= requestAnimationFrame(paint);
    };
    const onLeave = () => {
      if (cur) reset(cur);
      cur = null;
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
