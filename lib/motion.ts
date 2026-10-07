// El movimiento está siempre activo: layout.tsx pone data-motion="on" en <html> antes del primer pintado.
// Se mantiene la función para poder apagarlo desde un solo lugar si hiciera falta.
export function motionOn(): boolean {
  return document.documentElement.dataset.motion !== 'off';
}
