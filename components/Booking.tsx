'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { track } from '@vercel/analytics';
import { TIME_ZONE, TIMES } from '@/lib/slots';
import { ArrowRight } from './icons';

// Formulario para agendar la llamada. Valida y envía el pedido por correo (app/api/booking/route.ts).

const RUBROS = ['E-commerce', 'Servicios', 'Salud', 'Educación', 'Gastronomía', 'Otro'];
const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

type Day = { key: string; iso: string; dow: string; day: number; mon: string };
type Form = { name: string; email: string; web: string; msg: string; rubro: string; date: string; dateISO: string; time: string };

// Próximos 8 días hábiles, contados desde hoy en hora Argentina (la que usa el calendario).
function nextWeekdays(): Day[] {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date()); // YYYY-MM-DD
  const d = new Date(`${today}T12:00:00Z`);
  const days: Day[] = [];
  while (days.length < 8) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() === 0 || d.getUTCDay() === 6) continue;
    days.push({
      key: `${DOW[d.getUTCDay()]} ${d.getUTCDate()} de ${MON[d.getUTCMonth()]}`,
      iso: d.toISOString().slice(0, 10),
      dow: DOW[d.getUTCDay()],
      day: d.getUTCDate(),
      mon: MON[d.getUTCMonth()]
    });
  }
  return days;
}

const EMPTY: Form = { name: '', email: '', web: '', msg: '', rubro: '', date: '', dateISO: '', time: '' };

type Errors = Partial<Record<'name' | 'email' | 'date' | 'time', string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Falta tu nombre.';
  if (!f.email.trim()) e.email = 'Falta tu email.';
  else if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Revisá el email: tiene que ser algo como vos@empresa.com.';
  if (!f.date) e.date = 'Elegí un día.';
  if (!f.time) e.time = 'Elegí un horario.';
  return e;
}

// Envío a /api/booking (correo por Gmail). Si rechaza, el formulario muestra un error y deja reintentar.
async function submit(data: Form & { company: string }): Promise<{ confirmed: boolean }> {
  const res = await fetch('/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(String(res.status));
  return { confirmed: !!((await res.json().catch(() => null)) as { confirmed?: boolean } | null)?.confirmed };
}

// Horarios libres de un día (si no hay calendario conectado, son todos los que ofrecemos).
async function loadSlots(iso: string): Promise<string[]> {
  try {
    const res = await fetch(`/api/slots?date=${iso}`, { cache: 'no-store' });
    if (!res.ok) return [...TIMES];
    return ((await res.json()) as { free: string[] }).free;
  } catch {
    return [...TIMES];
  }
}

export default function Booking() {
  const [days, setDays] = useState<Day[]>([]);
  const [f, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false); // la llamada ya quedó reservada en el calendario (con Meet)
  const [free, setFree] = useState<string[] | null>(null); // horarios libres del día elegido; null = todavía no se sabe
  const [taken, setTaken] = useState(false); // el horario elegido se ocupó mientras completaba el formulario
  const doneRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const refocusDays = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);

  // Resumen que mandó el cotizador (evento window 'cm:quote'); queda adjunto al mensaje hasta que lo quiten.
  const [quote, setQuote] = useState('');
  const quoteRef = useRef('');

  useEffect(() => setDays(nextWeekdays()), []);

  useEffect(() => {
    const onQuote = (ev: Event) => {
      const summary = (ev as CustomEvent<{ summary?: string }>).detail?.summary?.trim();
      if (!summary) return;
      const prev = quoteRef.current;
      quoteRef.current = summary;
      setQuote(summary);
      setForm(s => {
        const msg = s.msg.trim();
        // Vacío o venía del cotizador: se reemplaza. Si el usuario escribió algo, se agrega abajo.
        if (!msg || msg === prev) return { ...s, msg: summary };
        if (prev && s.msg.includes(prev)) return { ...s, msg: s.msg.replace(prev, summary) };
        return { ...s, msg: `${s.msg.trimEnd()}\n\n${summary}` };
      });
    };
    window.addEventListener('cm:quote', onQuote);
    return () => window.removeEventListener('cm:quote', onQuote);
  }, []);

  const removeQuote = () => {
    const q = quoteRef.current;
    quoteRef.current = '';
    setQuote('');
    setForm(s => ({ ...s, msg: s.msg.replace(q, '').trim() }));
  };

  useEffect(() => {
    if (sent) doneRef.current?.focus();
    else if (refocusDays.current) {
      refocusDays.current = false;
      formRef.current?.querySelector<HTMLElement>('#bk-date button')?.focus();
    }
  }, [sent]);

  const pickDay = (d: Day) => {
    setForm(s => ({ ...s, date: d.key, dateISO: d.iso, time: '' }));
    setFailed(false);
    setTaken(false);
    setFree(null);
    if ('date' in errors) setErrors(e => ({ ...e, date: undefined }));
    loadSlots(d.iso).then(setFree);
  };

  const set = (k: keyof Form, v: string) => {
    setForm(s => ({ ...s, [k]: v }));
    setFailed(false);
    if (k in errors) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (loading) return;
    const e = validate(f);
    setErrors(e);
    setFailed(false);
    const bad = (['name', 'email', 'date', 'time'] as const).filter(k => e[k]);
    const first = bad[0];
    if (first) {
      bad.forEach(k =>
        formRef.current?.querySelector(`#bk-${k}`)?.animate(
          { translate: ['0', '-10px', '8px', '-5px', '3px', '0'] },
          { duration: 380, easing: 'ease-out' }
        )
      );
      const sel = first === 'date' || first === 'time' ? `#bk-${first} button` : `#bk-${first}`;
      formRef.current?.querySelector<HTMLElement>(sel)?.focus();
      return;
    }
    setLoading(true);
    try {
      const r = await submit({ ...f, name: f.name.trim(), email: f.email.trim(), company: honeypot.current?.value || '' });
      setConfirmed(r.confirmed);
      setSent(true);
      track('booking_submit');
    } catch (err) {
      if (err instanceof Error && err.message === '409') {
        // Otra persona reservó ese horario: se vuelve a leer el calendario y se pide elegir otro.
        setTaken(true);
        setForm(s => ({ ...s, time: '' }));
        loadSlots(f.dateISO).then(setFree);
      } else setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bk-done" role="status">
        <div aria-hidden="true" className="bk-check">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h3 ref={doneRef} tabIndex={-1}>
          ¡Listo, {f.name.trim()}!
        </h3>
        <p>
          {confirmed ? (
            <>
              Tu llamada quedó confirmada para el <strong>{`${f.date} a las ${f.time} h`}</strong>. Te enviamos la invitación con el link de la videollamada a {f.email.trim()}.
            </>
          ) : (
            <>
              Recibimos tu pedido para el <strong>{`${f.date} a las ${f.time} h`}</strong>. Te confirmamos el horario por email a {f.email.trim()}.
            </>
          )}
        </p>
        <button
          type="button"
          className="bk-ghost"
          onClick={() => {
            refocusDays.current = true;
            setSent(false);
            setForm(s => ({ ...s, date: '', time: '' }));
          }}
        >
          Cambiar fecha
        </button>
      </div>
    );
  }

  const hasQuote = !!quote && f.msg.includes(quote);

  return (
    <form className="bk" ref={formRef} onSubmit={onSubmit} noValidate aria-busy={loading}>
      <div className="bk-row bk-row--stack">
        <div className="bk-field">
          <label className="bk-label" htmlFor="bk-name">
            Nombre
          </label>
          <input
            id="bk-name"
            name="name"
            className="bk-input"
            value={f.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Tu nombre"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'bk-name-err' : undefined}
          />
          {errors.name && (
            <span id="bk-name-err" className="bk-error">
              {errors.name}
            </span>
          )}
        </div>
        <div className="bk-field">
          <label className="bk-label" htmlFor="bk-email">
            Email
          </label>
          <input
            id="bk-email"
            name="email"
            type="email"
            inputMode="email"
            className="bk-input"
            value={f.email}
            onChange={e => set('email', e.target.value)}
            placeholder="vos@empresa.com"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'bk-email-err' : undefined}
          />
          {errors.email && (
            <span id="bk-email-err" className="bk-error">
              {errors.email}
            </span>
          )}
        </div>
      </div>
      <input ref={honeypot} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      <div className="bk-field">
        <label className="bk-label" htmlFor="bk-web">
          Tu sitio web <small>(opcional)</small>
        </label>
        <input
          id="bk-web"
          name="web"
          inputMode="url"
          className="bk-input"
          value={f.web}
          onChange={e => set('web', e.target.value)}
          placeholder="www.tunegocio.com"
          autoComplete="url"
        />
      </div>

      <div role="group" aria-labelledby="bk-rubro-l" className="bk-group">
        <span id="bk-rubro-l" className="bk-label">
          Tipo de negocio
        </span>
        <div className="bk-chips">
          {RUBROS.map(r => (
            <button
              key={r}
              type="button"
              className="bk-opt bk-opt--chip"
              aria-pressed={f.rubro === r}
              onClick={() => set('rubro', f.rubro === r ? '' : r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div
        id="bk-date"
        role="group"
        aria-labelledby="bk-date-l"
        aria-describedby={errors.date ? 'bk-date-err' : undefined}
        className="bk-group"
        data-invalid={errors.date ? 'true' : undefined}
      >
        <span id="bk-date-l" className="bk-label">
          Elegí un día
        </span>
        <div className="bk-seg bk-seg--days">
          {days.map(d => (
            <button
              key={d.key}
              type="button"
              className="bk-opt bk-opt--day"
              aria-pressed={f.date === d.key}
              aria-label={d.key}
              onClick={() => pickDay(d)}
            >
              <span className="dow">{d.dow}</span>
              <span className="num">{d.day}</span>
              <span className="mon">{d.mon}</span>
            </button>
          ))}
        </div>
        {errors.date && (
          <span id="bk-date-err" className="bk-error">
            {errors.date}
          </span>
        )}
      </div>

      <div
        id="bk-time"
        role="group"
        aria-labelledby="bk-time-l"
        aria-describedby={errors.time ? 'bk-time-err' : undefined}
        className="bk-group"
        data-invalid={errors.time ? 'true' : undefined}
      >
        <span id="bk-time-l" className="bk-label">
          Horario (hora Argentina)
        </span>
        <div className="bk-seg bk-seg--times">
          {TIMES.map(t => (
            <button
              key={t}
              type="button"
              className="bk-opt bk-opt--time"
              aria-pressed={f.time === t}
              disabled={free !== null && !free.includes(t)}
              onClick={() => set('time', t)}
            >
              {t}
            </button>
          ))}
        </div>
        {free !== null && free.length === 0 && (
          <span className="bk-note" role="status">
            Ese día no tiene horarios libres. Probá con otro.
          </span>
        )}
        {errors.time && (
          <span id="bk-time-err" className="bk-error">
            {errors.time}
          </span>
        )}
      </div>

      <div className="bk-field">
        <label className="bk-label" htmlFor="bk-msg">
          ¿Qué te gustaría resolver? <small>(opcional)</small>
        </label>
        <div className="bk-live" aria-live="polite">
          {hasQuote && (
            <span className="bk-quote">
              Presupuesto adjunto
              <button type="button" onClick={removeQuote} aria-label="Quitar el presupuesto del mensaje">
                ×
              </button>
            </span>
          )}
        </div>
        <textarea
          id="bk-msg"
          name="msg"
          className="bk-input"
          value={f.msg}
          onChange={e => set('msg', e.target.value)}
          rows={hasQuote ? 6 : 3}
          placeholder="Ej: nos escriben mucho por envíos y cambios"
        />
      </div>

      {taken && (
        <span role="alert" className="bk-alert">
          Ese horario se acaba de ocupar. Elegí otro de los que quedan libres.
        </span>
      )}

      {failed && (
        <span role="alert" className="bk-alert">
          No pudimos enviar tu pedido. Probá de nuevo en un momento o escribinos por email.
        </span>
      )}

      <button type="submit" className="bk-submit" disabled={loading}>
        {loading ? 'Enviando…' : 'Confirmar llamada'} {loading ? <span aria-hidden="true" className="bk-spin" /> : <ArrowRight />}
      </button>
    </form>
  );
}
