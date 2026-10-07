'use client';

import { useEffect, useRef, useState } from 'react';
import '@/app/styles/quote.css';
import { ArrowRight } from './icons';
import { motionOn } from '@/lib/motion';
import {
  BUSINESSES,
  DEFAULT_SELECTION,
  FEATURES,
  MAINTENANCE,
  VOLUMES,
  estimate,
  formatMoney,
  summaryText,
  type FeatureId,
  type Selection
} from '@/lib/pricing';

// Cotizador: el visitante arma su agente y ve una estimación. Los precios viven en lib/pricing.ts.

// Número que cuenta hasta el valor nuevo. Sin movimiento, salta directo.
function useCountUp(target: number): number {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    if (start === target || !motionOn()) {
      from.current = target;
      setShown(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 600);
      const v = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 3)));
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

function featurePrice(setup: number, monthly: number, included?: boolean): string {
  if (included) return 'Incluido';
  return [setup && `+${formatMoney(setup)}`, monthly && `+${formatMoney(monthly)}/mes`].filter(Boolean).join(' · ');
}

export default function Quote() {
  const [sel, setSel] = useState<Selection>(DEFAULT_SELECTION);
  const [open, setOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { setup, monthly } = estimate(sel);
  const setupShown = useCountUp(setup);
  const monthlyShown = useCountUp(monthly ?? 0);
  const business = BUSINESSES.find(b => b.id === sel.business) ?? BUSINESSES[0];
  const chosen = FEATURES.filter(f => f.included || sel.features.includes(f.id));
  const monthlyText = monthly === null ? 'A medida' : `${formatMoney(monthly)} por mes`;

  // La barra inferior (móvil) solo aparece mientras la sección está en pantalla.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '-30% 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const toggle = (id: FeatureId) =>
    setSel(s => ({ ...s, features: s.features.includes(id) ? s.features.filter(f => f !== id) : [...s.features, id] }));

  const send = () => {
    window.dispatchEvent(new CustomEvent('cm:quote', { detail: { summary: summaryText(sel) } }));
    setOpen(false);
  };

  return (
    <section id="cotizador" ref={sectionRef} className="section qt" aria-labelledby="qt-title">
      <div className="wrap section__inner qt__inner">
        <div className="qt__head">
          <h2 id="qt-title" className="h2" data-headline>
            Armá tu agente y mirá <em className="accent">cuánto cuesta</em>.
          </h2>
          <p className="lead">
            Elegí lo que necesitás y te mostramos una estimación al momento. Es orientativa: el precio final lo definimos juntos en la llamada,
            cuando conozcamos tu web y tus consultas.
          </p>
        </div>

        <div className="qt__grid">
          <div className="qt__form">
            <fieldset className="qt__group">
              <legend>¿Qué tipo de negocio tenés?</legend>
              <div className="qt__chips">
                {BUSINESSES.map(b => (
                  <label key={b.id} className="qt__chip">
                    <input
                      type="radio"
                      name="qt-business"
                      checked={sel.business === b.id}
                      onChange={() => setSel(s => ({ ...s, business: b.id }))}
                    />
                    <span>{b.label}</span>
                  </label>
                ))}
              </div>
              <p className="qt__hint">
                Suele resolver: <span className="qt__examples">{business.examples.join(' · ')}</span>
              </p>
            </fieldset>

            <fieldset className="qt__group">
              <legend>¿Cuántas conversaciones esperás por mes?</legend>
              <div className="qt__seg">
                {VOLUMES.map(v => (
                  <label key={v.id} className="qt__segopt">
                    <input type="radio" name="qt-volume" checked={sel.volume === v.id} onChange={() => setSel(s => ({ ...s, volume: v.id }))} />
                    <span>{v.label}</span>
                  </label>
                ))}
              </div>
              <p className="qt__hint">Si no sabés, empezá por lo chico: se puede cambiar después.</p>
            </fieldset>

            <fieldset className="qt__group">
              <legend>¿Qué querés que haga?</legend>
              <ul className="qt__features">
                {FEATURES.map(f => {
                  const on = f.included || sel.features.includes(f.id);
                  const suggested = !f.included && business.suggested.includes(f.id);
                  return (
                    <li key={f.id}>
                      <label className="qt__feat" data-on={on || undefined}>
                        <input
                          type="checkbox"
                          role="switch"
                          checked={on}
                          disabled={f.included}
                          aria-describedby={`qt-f-${f.id}`}
                          onChange={() => toggle(f.id)}
                        />
                        <span aria-hidden="true" className="qt__switch" />
                        <span className="qt__feattext">
                          <span className="qt__featname">
                            {f.label}
                            {suggested && <span className="qt__tag">Suele servir en tu rubro</span>}
                          </span>
                          <span id={`qt-f-${f.id}`} className="qt__featdesc">
                            {f.description}
                          </span>
                        </span>
                        <span className="qt__featprice">{featurePrice(f.setup, f.monthly, f.included)}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <fieldset className="qt__group">
              <legend>Mantenimiento</legend>
              <div className="qt__seg qt__seg--two">
                {MAINTENANCE.map(m => (
                  <label key={m.id} className="qt__segopt qt__segopt--tall">
                    <input
                      type="radio"
                      name="qt-maint"
                      checked={sel.maintenance === m.id}
                      onChange={() => setSel(s => ({ ...s, maintenance: m.id }))}
                    />
                    <span>
                      <strong>
                        {m.label} <small>{m.monthly ? `+${formatMoney(m.monthly)}/mes` : 'Incluido'}</small>
                      </strong>
                      <small>{m.detail}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="qt__aside" data-open={open || undefined} data-inview={inView || undefined} aria-label="Tu estimación">
            <div className="qt__card glass">
              <button
                type="button"
                className="qt__bar"
                aria-expanded={open}
                aria-controls="qt-detail"
                onClick={() => setOpen(o => !o)}
              >
                <span className="qt__barnums" aria-hidden="true">
                  <span>{formatMoney(setupShown)}</span>
                  <span>{`pago único + ${monthly === null ? 'abono a medida' : `${formatMoney(monthlyShown)}/mes`}`}</span>
                </span>
                <span className="qt__barlabel">{open ? 'Cerrar' : 'Ver detalle'}</span>
              </button>

              <div className="qt__totals" aria-hidden="true">
                <div className="qt__total">
                  <span className="qt__totallabel">Implementación, pago único</span>
                  <span className="qt__num">{formatMoney(setupShown)}</span>
                </div>
                <div className="qt__total">
                  <span className="qt__totallabel">Abono mensual</span>
                  <span className="qt__num">
                    {monthly === null ? 'A medida' : formatMoney(monthlyShown)}
                    {monthly !== null && <small>/mes</small>}
                  </span>
                </div>
              </div>
              <p className="sr-only" aria-live="polite">
                {`Implementación ${formatMoney(setup)}, pago único. Abono: ${monthlyText}.`}
              </p>

              <div id="qt-detail" className="qt__detail">
                <ul className="qt__list">
                  <li>{business.label}</li>
                  <li>{VOLUMES.find(v => v.id === sel.volume)?.label} conversaciones por mes</li>
                  {chosen.map(f => (
                    <li key={f.id}>{f.label}</li>
                  ))}
                  <li>Mantenimiento {MAINTENANCE.find(m => m.id === sel.maintenance)?.label.toLowerCase()}</li>
                </ul>
                <p className="qt__note">
                  Estimación orientativa. {monthly === null && 'Con más de 5.000 conversaciones armamos el abono según tu caso. '}
                  El precio final lo confirmamos en la llamada.
                </p>
                <a href="#agendar" className="btn btn--solid qt__cta" onClick={send}>
                  Agendar con este presupuesto <ArrowRight />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
