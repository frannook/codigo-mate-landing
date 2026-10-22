// Horarios de las llamadas. Lo usan el formulario (navegador) y el servidor, así siempre coinciden.
export const TIMES = ['10:00', '11:30', '14:00', '15:30', '17:00'];
export const CALL_MINUTES = 30;
export const TIME_ZONE = 'America/Argentina/Buenos_Aires'; // UTC-3 todo el año, sin horario de verano
export const MAX_DAYS_AHEAD = 21;
export const MIN_NOTICE_HOURS = 2;

export const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
export const slotStart = (date: string, time: string) => new Date(`${date}T${time}:00-03:00`);

// ¿Es un día y horario que ofrecemos? (día hábil, dentro de la ventana y con aviso mínimo)
export function isOfferable(date: string, time: string, now = new Date()): boolean {
  if (!isIsoDate(date) || !TIMES.includes(time)) return false;
  const start = slotStart(date, time);
  if (Number.isNaN(start.getTime())) return false;
  const weekday = new Date(`${date}T12:00:00-03:00`).getUTCDay();
  if (weekday === 0 || weekday === 6) return false;
  const ms = start.getTime() - now.getTime();
  return ms >= MIN_NOTICE_HOURS * 3_600_000 && ms <= MAX_DAYS_AHEAD * 86_400_000;
}
