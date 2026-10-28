// Recibe el formulario de agendar. Con Google Calendar configurado (lib/calendar.ts) reserva el horario, crea el evento con
// link de Meet y Google le manda la invitación al cliente. Siempre manda por Gmail SMTP el aviso al equipo (con Reply-To al
// cliente) y la confirmación al cliente. Sin calendario, o si Google falla, funciona solo por correo.
// Credenciales solo en el servidor: GMAIL_USER, GMAIL_APP_PASSWORD, BOOKING_TO (opcional) y, para la planilla de contactos
// (opcional), LEADS_WEBHOOK_URL.

import nodemailer from 'nodemailer';
import { calendarEnabled, createCall, freeTimes } from '@/lib/calendar';
import { confirmationEmail, eventDescription } from '@/lib/mail';
import { clientIp, rateLimit } from '@/lib/ratelimit';
import { isIsoDate, isOfferable } from '@/lib/slots';

export const runtime = 'nodejs';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
// Evita inyección de encabezados en nombre/asunto.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ');

export async function POST(req: Request) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return Response.json({ error: 'not_configured' }, { status: 503 });

  // 5 pedidos cada 10 minutos por IP (compartido entre instancias si hay Redis; ver lib/ratelimit.ts).
  if (await rateLimit(`booking:${clientIp(req)}`, 5, 600)) return Response.json({ error: 'rate_limited' }, { status: 429 });

  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return Response.json({ error: 'invalid' }, { status: 400 });

  // Campo trampa: las personas no lo ven ni lo completan. Fingimos éxito para no avisarle al bot.
  if (str(b.company, 100)) return Response.json({ ok: true });

  const name = oneLine(str(b.name, 100));
  const email = oneLine(str(b.email, 200));
  const date = oneLine(str(b.date, 40));
  const dateISO = str(b.dateISO, 10);
  const time = oneLine(str(b.time, 10));
  const web = oneLine(str(b.web, 200));
  const rubro = oneLine(str(b.rubro, 40));
  const msg = str(b.msg, 1500);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !date || !time) return Response.json({ error: 'invalid' }, { status: 400 });

  const details = [`Web: ${web || '-'}`, `Rubro: ${rubro || '-'}`, '', `Mensaje:\n${msg || '-'}`].join('\n');

  // Reserva en el calendario: se vuelve a comprobar que el horario siga libre y se crea el evento con Meet.
  let meet: string | undefined;
  let eventLink: string | undefined;
  if (calendarEnabled() && isIsoDate(dateISO)) {
    try {
      if (!isOfferable(dateISO, time) || !(await freeTimes(dateISO)).includes(time)) {
        return Response.json({ error: 'slot_taken' }, { status: 409 });
      }
      const ev = await createCall({ date: dateISO, time, name, email, description: eventDescription({ name, date, time, web, rubro, msg }) });
      meet = ev.meet;
      eventLink = ev.link;
    } catch (error) {
      // Google falló: el pedido no se pierde, sigue por correo y el equipo confirma a mano.
      console.error('[api/booking] calendario', error);
    }
  }

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
        details.split('\n\n')[0],
        `Día y hora pedidos: ${date} a las ${time} h (hora Argentina)`,
        meet ? `Videollamada (Meet): ${meet}` : 'Sin evento en el calendario: confirmar el horario con el cliente.',
        eventLink ? `Evento: ${eventLink}` : '',
        '',
        `Mensaje:\n${msg || '-'}`
      ]
        .filter((l, i, a) => l !== '' || a[i - 1] !== '')
        .join('\n')
    });
  } catch (error) {
    console.error('[api/booking] envío al equipo', error);
    // Con el evento ya creado, Google le mandó la invitación al cliente y el equipo lo ve en el calendario:
    // no se muestra error (reintentar chocaría con el horario recién reservado).
    if (!meet) return Response.json({ error: 'send_failed' }, { status: 502 });
  }

  // La confirmación al cliente es secundaria: si falla, el pedido ya llegó al equipo.
  try {
    const mail = confirmationEmail({ name, date, time, meet, web, rubro, msg });
    await transport.sendMail({ from: `Código Mate <${user}>`, to: email, replyTo: user, subject: mail.subject, text: mail.text, html: mail.html });
  } catch (error) {
    console.warn('[api/booking] confirmación al cliente', error);
  }

  // Planilla de contactos (opcional): un webhook de Google Apps Script que agrega una fila. No bloquea ni rompe el pedido.
  const hook = process.env.LEADS_WEBHOOK_URL;
  if (hook) {
    await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, web, rubro, date, time, msg, meet: meet || '', createdAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(4000)
    }).catch(error => console.warn('[api/booking] planilla', error));
  }

  return Response.json({ ok: true, confirmed: !!meet });
}
