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

  useEffect(() => setDays(nextWeekdays()), []);

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
      <div className="done" role="status">
        <div aria-hidden="true" className="done__check">
          ✓
        </div>
        <h3 ref={doneRef} tabIndex={-1}>
          ¡Listo, {f.name.trim()}!
        </h3>
        <p>
          Recibimos tu pedido para el <strong>{`${f.date} a las ${f.time} h`}</strong>. Te confirmamos el horario por email a {f.email.trim()}.
        </p>
        <button
          type="button"
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

  return (
    <form className="form" ref={formRef} onSubmit={onSubmit} noValidate aria-busy={loading}>
      <div className="form__row">
        <div className="field">
          <label htmlFor="bk-name">Nombre</label>
          <input
            id="bk-name"
            name="name"
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
            <span id="bk-name-err" className="field__error">
              {errors.name}
            </span>
          )}
        </div>
        <div className="field">
          <label htmlFor="bk-email">Email</label>
          <input
            id="bk-email"
            name="email"
            type="email"
            inputMode="email"
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
            <span id="bk-email-err" className="field__error">
              {errors.email}
            </span>
          )}
        </div>
      </div>
      <input ref={honeypot} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      <div className="field">
        <label htmlFor="bk-web">Tu sitio web</label>
        <input
          id="bk-web"
          name="web"
          inputMode="url"
          value={f.web}
          onChange={e => set('web', e.target.value)}
          placeholder="www.tunegocio.com"
          autoComplete="url"
        />
      </div>

      <div role="group" aria-labelledby="bk-rubro-l" className="group">
        <span id="bk-rubro-l" className="group__label">
          Tipo de negocio
        </span>
        <div className="opts">
          {RUBROS.map(r => (
            <button
              key={r}
              type="button"
              className="opt opt--pill"
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
        className="group"
        data-invalid={errors.date ? 'true' : undefined}
      >
        <span id="bk-date-l" className="group__label">
          Elegí un día
        </span>
        <div className="opts--days">
          {days.map(d => (
            <button
              key={d.key}
              type="button"
              className="opt opt--day"
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
          <span id="bk-date-err" className="field__error">
            {errors.date}
          </span>
        )}
      </div>

      <div
        id="bk-time"
        role="group"
        aria-labelledby="bk-time-l"
        aria-describedby={errors.time ? 'bk-time-err' : undefined}
        className="group"
        data-invalid={errors.time ? 'true' : undefined}
      >
        <span id="bk-time-l" className="group__label">
          Horario (hora Argentina)
        </span>
        <div className="opts--times">
          {TIMES.map(t => (
            <button key={t} type="button" className="opt opt--time" aria-pressed={f.time === t} onClick={() => set('time', t)}>
              {t}
            </button>
          ))}
        </div>
        {errors.time && (
          <span id="bk-time-err" className="field__error">
            {errors.time}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="bk-msg">¿Qué te gustaría resolver? (opcional)</label>
        <textarea
          id="bk-msg"
          name="msg"
          value={f.msg}
          onChange={e => set('msg', e.target.value)}
          rows={3}
          placeholder="Ej: nos escriben mucho por envíos y cambios"
        />
      </div>

      {failed && (
        <span role="alert" className="form__error">
          No pudimos enviar tu pedido. Probá de nuevo en un momento o escribinos por email.
        </span>
      )}

      <button type="submit" className="btn btn--solid btn--submit" disabled={loading}>
        {loading ? 'Enviando…' : 'Confirmar llamada'} {!loading && <ArrowRight />}
      </button>
    </form>
  );
}
