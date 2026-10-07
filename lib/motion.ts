// Preferencia de movimiento. Por defecto sigue al sistema (prefers-reduced-motion); el interruptor de la barra
// la sobrescribe y queda guardada. layout.tsx pone data-motion="on|off" en <html> antes del primer pintado.
export const MOTION_KEY = 'cm-motion';

export function motionOn(): boolean {
  return document.documentElement.dataset.motion !== 'off';
}
