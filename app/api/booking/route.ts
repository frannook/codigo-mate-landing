// Recibe el formulario de agendar y manda dos correos por Gmail SMTP (gratis, sin dominio propio):
// el aviso al equipo (con Reply-To al cliente) y la confirmación de recepción al cliente.
// Credenciales solo en el servidor: GMAIL_USER, GMAIL_APP_PASSWORD (contraseña de aplicación), BOOKING_TO (opcional).

import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

// Límite simple por IP: 5 pedidos cada 10 minutos. En memoria, por instancia (ver README).
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 2000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
// Evita inyección de encabezados en nombre/asunto.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ');

export async function POST(req: Request) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return Response.json({ error: 'not_configured' }, { status: 503 });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return Response.json({ error: 'rate_limited' }, { status: 429 });

  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return Response.json({ error: 'invalid' }, { status: 400 });

  // Campo trampa: las personas no lo ven ni lo completan. Fingimos éxito para no avisarle al bot.
  if (str(b.company, 100)) return Response.json({ ok: true });

  const name = oneLine(str(b.name, 100));
  const email = oneLine(str(b.email, 200));
  const date = oneLine(str(b.date, 40));
  const time = oneLine(str(b.time, 10));
  const web = oneLine(str(b.web, 200));
  const rubro = oneLine(str(b.rubro, 40));
  const msg = str(b.msg, 1500);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !date || !time) return Response.json({ error: 'invalid' }, { status: 400 });

  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  const to = process.env.BOOKING_TO || user;

  try {
    await transport.sendMail({
      from: `Código Mate <${user}>`,
      to,
      replyTo: `${name} <${email}>`,
      subject: `Nueva llamada: ${name} · ${date} ${time} h`,
      text: [
        `Nombre: ${name}`,
        `Email: ${email}`,
        `Web: ${web || '-'}`,
        `Rubro: ${rubro || '-'}`,
        `Día y hora pedidos: ${date} a las ${time} h (hora Argentina)`,
        '',
        `Mensaje:\n${msg || '-'}`
      ].join('\n')
    });
  } catch (error) {
    console.error('[api/booking] envío al equipo', error);
    return Response.json({ error: 'send_failed' }, { status: 502 });
  }

  // La confirmación al cliente es secundaria: si falla, el pedido ya llegó al equipo.
  try {
    await transport.sendMail({
      from: `Código Mate <${user}>`,
      to: email,
      subject: 'Recibimos tu pedido de llamada · Código Mate',
      text: [
        `Hola ${name},`,
        '',
        `Recibimos tu pedido para hablar el ${date} a las ${time} h (hora Argentina).`,
        'Te confirmamos el horario por este mismo medio y te enviamos el link de la videollamada.',
        '',
        '¡Gracias!',
        'Equipo de Código Mate'
      ].join('\n')
    });
  } catch (error) {
    console.warn('[api/booking] confirmación al cliente', error);
  }

  return Response.json({ ok: true });
}
