'use client';

import { useState } from 'react';
import CountUp from '@/components/CountUp';

type Period = 'hoy' | 'semana';

// Datos de ejemplo: lo que vería el dueño del negocio en su panel. No son mediciones reales.
const DATA: Record<
  Period,
  {
    stats: { value: number; suffix?: string; label: string }[];
    hours: number[]; // 24 barras (0 a 23 h), alturas de 0 a 100
    topics: [string, number][];
  }
> = {
  hoy: {
    stats: [
      { value: 184, label: 'Conversaciones' },
      { value: 91, suffix: '%', label: 'Resueltas por el agente' },
      { value: 17, label: 'Derivadas a WhatsApp' }
    ],
    hours: [18, 10, 6, 4, 3, 5, 12, 24, 38, 52, 60, 66, 58, 48, 54, 62, 70, 64, 56, 72, 80, 68, 44, 28],
    topics: [
      ['Envíos y plazos', 38],
      ['Cambios y devoluciones', 24],
      ['Precios y medios de pago', 18],
      ['Horarios y turnos', 12],
      ['Otras consultas', 8]
    ]
  },
  semana: {
    stats: [
      { value: 1236, label: 'Conversaciones' },
      { value: 89, suffix: '%', label: 'Resueltas por el agente' },
      { value: 131, label: 'Derivadas a WhatsApp' }
    ],
    hours: [22, 14, 9, 6, 5, 8, 16, 30, 44, 58, 66, 72, 62, 52, 60, 68, 76, 70, 62, 78, 86, 74, 50, 34],
    topics: [
      ['Envíos y plazos', 34],
      ['Precios y medios de pago', 26],
      ['Cambios y devoluciones', 20],
      ['Horarios y turnos', 13],
      ['Otras consultas', 7]
    ]
  }
};

const RECENT: { who: string; text: string; state: 'Resuelta' | 'Derivada'; av: number; time: string }[] = [
  { who: 'Lucía', text: '¿Hacen envíos a Mercedes, Corrientes?', state: 'Resuelta', av: 0, time: '23:47' },
  { who: 'Martín', text: 'Quiero cambiar un talle de mi pedido 4821', state: 'Derivada', av: 2, time: '21:10' },
  { who: 'Sofía', text: '¿Aceptan transferencia y en cuántas cuotas?', state: 'Resuelta', av: 4, time: '19:32' }
];

// "Lo que ve el dueño": panel de ejemplo con selector Hoy / Esta semana, contadores y barras que crecen al entrar en pantalla.
export default function OwnerPanel() {
  const [period, setPeriod] = useState<Period>('hoy');
  const d = DATA[period];
  const tabs: [Period, string][] = [
    ['hoy', 'Hoy'],
    ['semana', 'Esta semana']
  ];

  return (
    <div className="op glass glass--strong" role="group" aria-label="Panel de ejemplo del dueño del negocio">
      <div className="op__bar">
        <span className="op__title">Panel de tu agente</span>
        <div className="op__tabs" role="tablist" aria-label="Período">
          {tabs.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={period === id} className="op__tab" onClick={() => setPeriod(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="op__stats">
        {d.stats.map(s => (
          <li key={s.label}>
            <strong>
              {/* key por período: el contador vuelve a animarse al cambiar de pestaña */}
              <CountUp key={`${period}-${s.label}`} value={s.value} suffix={s.suffix} duration={900} />
            </strong>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>

      <div className="op__grid">
        <section className="op__card" aria-label="Conversaciones por hora">
          <h3>Conversaciones por hora</h3>
          <div className="op__chart" role="img" aria-label="Gráfico de barras: hay actividad todo el día, con un pico entre las 19 y las 21 horas.">
            {d.hours.map((h, i) => (
              <span key={i} className={`op__bar-col${i < 8 || i >= 22 ? ' is-night' : ''}`} style={{ '--h': `${h}%`, '--i': i } as React.CSSProperties} />
            ))}
          </div>
          <div className="op__axis" aria-hidden="true">
            <span>0 h</span>
            <span>6 h</span>
            <span>12 h</span>
            <span>18 h</span>
            <span>23 h</span>
          </div>
          <p className="op__legend">
            <i aria-hidden="true" /> Fuera de horario: el agente atendió mientras el negocio estaba cerrado.
          </p>
        </section>

        <section className="op__card" aria-label="Temas más preguntados">
          <h3>Lo que más preguntan</h3>
          <ul className="op__topics">
            {d.topics.map(([name, pct]) => (
              <li key={name}>
                <span>{name}</span>
                <b>{pct}%</b>
                <i style={{ '--w': `${pct * 2.2}%` } as React.CSSProperties} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="op__card op__recent" aria-label="Últimas conversaciones">
        <h3>Últimas conversaciones</h3>
        <ul>
          {RECENT.map(r => (
            <li key={r.who}>
              <span className={`avatar av-${r.av}`} aria-hidden="true">
                {r.who[0]}
              </span>
              <span className="op__msg">
                <strong>{r.who}</strong>
                <small>{r.text}</small>
              </span>
              <span className={`op__state${r.state === 'Derivada' ? ' is-wa' : ''}`}>{r.state}</span>
              <time>{r.time}</time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
