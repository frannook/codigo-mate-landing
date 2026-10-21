// El movimiento está siempre activo: layout.tsx pone data-motion="on" en <html> antes del primer pintado.
// Se mantiene la función para poder apagarlo desde un solo lugar si hiciera falta.
// Espejo de los tokens de globals.css (--ease-out, --dur-*). Ver MOTION.md.
export const MOTION = {
  ease: 'expo.out',
  easeIn: 'expo.in',
  quick: 0.15,
  std: 0.35,
  slow: 0.7,
} as const;

export function motionOn(): boolean {
  return document.documentElement.dataset.motion !== 'off';
}

// Celulares y tablets: el movimiento sigue activo pero sin los efectos más caros (desenfoque, scroll suave, imán).
export function isLite(): boolean {
  return window.matchMedia('(max-width: 899px), (pointer: coarse)').matches;
}

// Corre cb recién cuando el elemento está por entrar en pantalla (una sola vez). Devuelve la función de limpieza.
export function whenNear(el: Element, cb: () => void, margin = '600px'): () => void {
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      cb();
    },
    { rootMargin: `${margin} 0px` }
  );
  io.observe(el);
  return () => io.disconnect();
}

// Espera al primer pintado antes de empezar a trabajar, así no compite con el contenido visible.
export function afterPaint(cb: () => void): () => void {
  let t = 0;
  const r = requestAnimationFrame(() => (t = window.setTimeout(cb, 0)));
  return () => {
    cancelAnimationFrame(r);
    clearTimeout(t);
  };
}
