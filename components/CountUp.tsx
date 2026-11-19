'use client';

import { useEffect, useRef, useState } from 'react';
import { motionOn } from '@/lib/motion';

// Número que sube desde 0 cuando entra en pantalla. Sin JS (o con el movimiento apagado) se ve el valor final.
export default function CountUp({ value, prefix = '', suffix = '', duration = 1400 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionOn() || !('IntersectionObserver' in window)) return;
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / duration);
          setN(Math.round(value * (1 - Math.pow(1 - k, 3)))); // ease-out cúbico
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="countup">
      {prefix}
      {n.toLocaleString('es-AR')}
      {suffix}
    </span>
  );
}
