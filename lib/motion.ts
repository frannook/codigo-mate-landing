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
