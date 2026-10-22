// Horarios libres de un día: GET /api/slots?date=YYYY-MM-DD → { calendar: boolean, free: string[] }
// Sin calendario configurado devuelve todos los horarios ofrecidos (el equipo confirma por correo).

import { calendarEnabled, freeTimes } from '@/lib/calendar';
import { clientIp, rateLimit } from '@/lib/ratelimit';
import { TIMES, isIsoDate, isOfferable } from '@/lib/slots';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

export async function GET(req: Request) {
  if (await rateLimit(`slots:${clientIp(req)}`, 60, 60)) return Response.json({ error: 'rate_limited' }, { status: 429 });
  const date = new URL(req.url).searchParams.get('date') || '';
  if (!isIsoDate(date)) return Response.json({ error: 'invalid' }, { status: 400 });

  const offered = TIMES.filter(t => isOfferable(date, t));
  if (!calendarEnabled()) return Response.json({ calendar: false, free: offered }, { headers: NO_STORE });
  try {
    return Response.json({ calendar: true, free: await freeTimes(date) }, { headers: NO_STORE });
  } catch (error) {
    console.error('[api/slots]', error);
    // Si Google falla no se frena el formulario: se muestran los horarios ofrecidos.
    return Response.json({ calendar: false, free: offered }, { headers: NO_STORE });
  }
}
