// Google Calendar por REST (sin dependencias): horarios libres y eventos con link de Meet.
// Variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN (se saca con scripts/google-auth.mjs)
// y GOOGLE_CALENDAR_ID (opcional, por defecto el calendario principal de la cuenta autorizada).
// Si falta alguna, calendarEnabled() es false y el formulario sigue funcionando solo por correo.

import { randomUUID } from 'node:crypto';
import { CALL_MINUTES, TIMES, TIME_ZONE, isOfferable, slotStart } from './slots';

const ID = process.env.GOOGLE_CLIENT_ID;
const SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH = process.env.GOOGLE_REFRESH_TOKEN;
const CAL = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || 'primary');
// Solo para pruebas locales con un servidor falso de Google.
const TOKEN_URL = process.env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token';
const API_BASE = process.env.GOOGLE_API_BASE || 'https://www.googleapis.com/calendar/v3';

export const calendarEnabled = () => !!(ID && SECRET && REFRESH);

let cached: { token: string; until: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && cached.until > Date.now() + 30_000) return cached.token;
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: ID!, client_secret: SECRET!, refresh_token: REFRESH!, grant_type: 'refresh_token' }),
    signal: AbortSignal.timeout(6000)
  });
  if (!res.ok) throw new Error(`google token ${res.status} ${(await res.text()).slice(0, 160)}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, until: Date.now() + j.expires_in * 1000 };
  return j.access_token;
}

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json', ...init?.headers },
    signal: AbortSignal.timeout(8000)
  });
  if (!res.ok) throw new Error(`calendar ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

type Ev = { status?: string; transparency?: string; start?: { dateTime?: string; date?: string }; end?: { dateTime?: string; date?: string } };

// Eventos que ocupan tiempo ese día (los marcados "libre" y los cancelados no cuentan).
async function busyBlocks(date: string): Promise<[number, number][]> {
  const q = new URLSearchParams({
    timeMin: `${date}T00:00:00-03:00`,
    timeMax: `${date}T23:59:59-03:00`,
    singleEvents: 'true',
    maxResults: '50',
    timeZone: TIME_ZONE
  });
  const j = (await api(`/calendars/${CAL}/events?${q}`)) as { items?: Ev[] };
  return (j.items || [])
    .filter(e => e.status !== 'cancelled' && e.transparency !== 'transparent')
    .map(e => {
      const s = e.start?.dateTime || `${e.start?.date}T00:00:00-03:00`;
      const f = e.end?.dateTime || `${e.end?.date}T00:00:00-03:00`;
      return [new Date(s).getTime(), new Date(f).getTime()] as [number, number];
    });
}

const overlaps = (blocks: [number, number][], from: number, to: number) => blocks.some(([a, b]) => a < to && b > from);

// Horarios libres de un día (sin los ocupados ni los que quedan fuera de la ventana de reserva).
export async function freeTimes(date: string): Promise<string[]> {
  const blocks = await busyBlocks(date);
  return TIMES.filter(t => {
    if (!isOfferable(date, t)) return false;
    const from = slotStart(date, t).getTime();
    return !overlaps(blocks, from, from + CALL_MINUTES * 60_000);
  });
}

export async function createCall(p: { date: string; time: string; name: string; email: string; description: string }) {
  const start = slotStart(p.date, p.time);
  const end = new Date(start.getTime() + CALL_MINUTES * 60_000);
  const q = new URLSearchParams({ conferenceDataVersion: '1', sendUpdates: 'all' });
  const ev = (await api(`/calendars/${CAL}/events?${q}`, {
    method: 'POST',
    body: JSON.stringify({
      summary: `Llamada con ${p.name} · Código Mate`,
      description: p.description,
      start: { dateTime: start.toISOString(), timeZone: TIME_ZONE },
      end: { dateTime: end.toISOString(), timeZone: TIME_ZONE },
      attendees: [{ email: p.email, displayName: p.name }],
      conferenceData: { createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
      reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 24 * 60 }, { method: 'popup', minutes: 15 }] }
    })
  })) as { id: string; htmlLink?: string; hangoutLink?: string };
  return { id: ev.id, link: ev.htmlLink, meet: ev.hangoutLink };
}
