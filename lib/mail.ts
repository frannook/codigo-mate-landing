// Textos de los correos y de la invitación de Google Calendar que ve el cliente.
import { SITE_URL, waLink } from './site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type Data = { name: string; date: string; time: string; meet?: string; web?: string; rubro?: string; msg?: string };

const AGENDA = [
  'Conocer tu negocio: qué te preguntan más tus clientes, tus horarios, precios y políticas.',
  'Ver cómo quedaría Yuyo, tu agente, en tu web (con tu tono de voz).',
  'Definir los próximos pasos y el presupuesto final, sin compromiso.'
];

// Descripción del evento de Calendar: la lee el cliente en la invitación, así que es un mensaje de bienvenida.
export function eventDescription(d: Data): string {
  const told = [d.web && d.web !== '-' ? `Web: ${d.web}` : '', d.rubro && d.rubro !== '-' ? `Rubro: ${d.rubro}` : ''].filter(Boolean);
  return [
    `¡Hola ${d.name}! Gracias por agendar una charla con Código Mate.`,
    '',
    'Qué vamos a ver en estos 30 minutos:',
    ...AGENDA.map((a, i) => `${i + 1}. ${a}`),
    '',
    'Para sacarle el jugo: tené a mano tu sitio y las 3 preguntas que más te repiten tus clientes.',
    '¿Necesitás cambiar el horario? Respondé el correo de confirmación o escribinos por WhatsApp: ' + waLink(),
    ...(told.length || d.msg ? ['', 'Lo que nos contaste:', ...told, ...(d.msg ? [d.msg] : [])] : []),
    '',
    'Equipo de Código Mate · ' + SITE_URL
  ].join('\n');
}

// Confirmación al cliente: bienvenida, cuándo es, cómo entrar y qué esperar.
export function confirmationEmail(d: Data) {
  const when = `${d.date} a las ${d.time} h (hora de Argentina)`;
  const subject = d.meet ? `Tu llamada con Código Mate está confirmada · ${d.date} ${d.time} h` : `Recibimos tu pedido de llamada · Código Mate`;
  const text = [
    `¡Hola ${d.name}!`,
    '',
    d.meet ? 'Gracias por agendar una charla con Código Mate. Tu llamada quedó confirmada.' : 'Gracias por escribirnos. Recibimos tu pedido de llamada y te confirmamos el horario por este medio.',
    '',
    `Cuándo: ${when}`,
    'Duración: 30 minutos, sin costo y sin compromiso',
    d.meet ? `Videollamada (Google Meet): ${d.meet}` : 'Te enviamos el link de la videollamada apenas confirmemos.',
    '',
    'Qué vamos a ver:',
    ...AGENDA.map((a, i) => `${i + 1}. ${a}`),
    '',
    'Para aprovecharla mejor, tené a mano tu sitio y las preguntas que más te repiten tus clientes.',
    d.meet ? 'También te llegó la invitación de Google Calendar con el recordatorio.' : '',
    '',
    `¿Querés cambiar el horario o contarnos algo antes? Respondé este correo o escribinos por WhatsApp: ${waLink()}`,
    '',
    '¡Gracias por confiar en nosotros!',
    'Equipo de Código Mate',
    SITE_URL
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#778da9;font-size:13px;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#0d1b2a;font-size:15px;font-weight:600">${v}</td></tr>`;
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#e9ecef;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9ecef;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0d1b2a;padding:24px 28px"><div style="color:#e9a23b;font-size:12px;letter-spacing:.14em;text-transform:uppercase">Código Mate</div>
<div style="color:#ffffff;font-size:24px;line-height:1.25;margin-top:6px">${d.meet ? 'Tu llamada está confirmada' : 'Recibimos tu pedido'}</div></td></tr>
<tr><td style="padding:28px">
<p style="margin:0 0 14px;color:#0d1b2a;font-size:16px;line-height:1.6">¡Hola ${esc(d.name)}! ${d.meet ? 'Gracias por agendar una charla con nosotros. Ya reservamos tu lugar.' : 'Gracias por escribirnos. Te confirmamos el horario por este medio.'}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 18px;border-left:3px solid #e9a23b;padding-left:14px">
${row('Cuándo', esc(when))}${row('Duración', '30 minutos · sin costo')}${d.meet ? row('Dónde', 'Videollamada por Google Meet') : ''}
</table>
${d.meet ? `<p style="margin:0 0 22px"><a href="${esc(d.meet)}" style="display:inline-block;background:#e9a23b;color:#0d1b2a;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:999px">Entrar a la videollamada</a></p>` : ''}
<p style="margin:0 0 8px;color:#0d1b2a;font-size:15px;font-weight:700">Qué vamos a ver</p>
<ol style="margin:0 0 18px;padding-left:20px;color:#243349;font-size:15px;line-height:1.6">${AGENDA.map(a => `<li>${esc(a)}</li>`).join('')}</ol>
<p style="margin:0 0 18px;color:#243349;font-size:15px;line-height:1.6">Para aprovecharla mejor, tené a mano tu sitio y las preguntas que más te repiten tus clientes.${d.meet ? ' También te llegó la invitación de Google Calendar con el recordatorio.' : ''}</p>
<p style="margin:0 0 4px;color:#243349;font-size:15px;line-height:1.6">¿Querés cambiar el horario o contarnos algo antes? Respondé este correo o escribinos por <a href="${esc(waLink())}" style="color:#b8742c;font-weight:700">WhatsApp</a>.</p>
</td></tr>
<tr><td style="background:#f4f5f2;padding:18px 28px;color:#778da9;font-size:13px;line-height:1.5">Equipo de Código Mate · <a href="${esc(SITE_URL)}" style="color:#778da9">${esc(SITE_URL.replace(/^https?:\/\//, ''))}</a></td></tr>
</table></td></tr></table></body></html>`;

  return { subject, text, html };
}
