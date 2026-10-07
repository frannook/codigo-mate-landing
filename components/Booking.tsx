'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight } from './icons';

// Formulario para agendar la llamada. Valida y envía el pedido por correo (app/api/booking/route.ts).

const RUBROS = ['E-commerce', 'Servicios', 'Salud', 'Educación', 'Gastronomía', 'Otro'];
const TIMES = ['10:00', '11:30', '14:00', '15:30', '17:00'];
const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

type Day = { key: string; dow: string; day: number; mon: string };
type Form = { name: string; email: string; web: string; msg: string; rubro: string; date: string; time: string };

// Próximos 8 días hábiles. Se calcula en el navegador para usar la fecha del visitante.
function nextWeekdays(): Day[] {
  const days: Day[] = [];
  const d = new Date();
  d.setHours(12);
  while (days.length < 8) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    days.push({
      key: `${DOW[d.getDay()]} ${d.getDate()} de ${MON[d.getMonth()]}`,
      dow: DOW[d.getDay()],
      day: d.getDate(),
      mon: MON[d.getMonth()]
    });
  }
  return days;
}

const EMPTY: Form = { name: '', email: '', web: '', msg: '', rubro: '', date: '', time: '' };

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
async function submit(data: Form & { company: string }): Promise<void> {
  const res = await fetch('/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(String(res.status));
}

export default function Booking() {
  const [days, setDays] = useState<Day[]>([]);
  const [f, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
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
    const first = (['name', 'email', 'date', 'time'] as const).find(k => e[k]);
    if (first) {
      const sel = first === 'date' || first === 'time' ? `#bk-${first} button` : `#bk-${first}`;
      formRef.current?.querySelector<HTMLElement>(sel)?.focus();
      return;
    }
    setLoading(true);
    try {
      await submit({ ...f, name: f.name.trim(), email: f.email.trim(), company: honeypot.current?.value || '' });
      setSent(true);
    } catch {
      setFailed(true);
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
          Recibimos tu pedido para el <strong>{`${f.date} a las ${f.time} h`}</strong>. Te confirmamos el horario por email a {f.email.trim()}.
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
      <div className="bk-row">
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
              onClick={() => set('date', d.key)}
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
            <button key={t} type="button" className="bk-opt bk-opt--time" aria-pressed={f.time === t} onClick={() => set('time', t)}>
              {t}
            </button>
          ))}
        </div>
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

      {failed && (
        <span role="alert" className="bk-alert">
          No pudimos enviar tu pedido. Probá de nuevo en un momento o escribinos por email.
        </span>
      )}

      <button type="submit" className="bk-submit" disabled={loading}>
        {loading ? 'Enviando…' : 'Confirmar llamada'} {!loading && <ArrowRight />}
      </button>
    </form>
  );
}
