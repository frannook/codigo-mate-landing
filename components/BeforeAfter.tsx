'use client';

import { useState } from 'react';
import CountUp from '@/components/CountUp';

const MSG = '¿Hacen envíos a Mercedes, Corrientes?';

// Comparador "sin agente / con agente": la misma consulta a las 23:47. Se arrastra el control (o se usan las flechas del teclado)
// para pasar de una mitad a la otra. Los datos son de ejemplo.
export default function BeforeAfter() {
  const [pos, setPos] = useState(50);

  return (
    <div className="ba">
      <p className="sr-only">
        Sin agente: la consulta llega a las 23:47 y se contesta recién a las 10:15 del día siguiente, 10 horas después; el cliente ya se fue. Con agente: la
        misma consulta se responde en 4 segundos con el plazo de envío y la opción de pasar a WhatsApp para comprar.
      </p>

      <div className="ba__stage" style={{ '--pos': pos } as React.CSSProperties} aria-hidden="true">
        <div className="ba__layer ba__layer--without">
          <span className="ba__tag">Sin agente</span>
          <div className="ba__chat">
            <p className="ba__msg ba__msg--user">{MSG}</p>
            <p className="ba__time">23:47 · mensaje recibido</p>
            <div className="ba__status ba__status--bad">
              <b>Sin respuesta</b>
              <span>El negocio está cerrado.</span>
            </div>
          </div>
          <p className="ba__result">
            Se contesta a las <strong>10:15</strong> del día siguiente. El cliente ya compró en otro lado.
          </p>
        </div>

        <div className="ba__layer ba__layer--with">
          <span className="ba__tag ba__tag--on">Con agente</span>
          <div className="ba__chat">
            <p className="ba__msg ba__msg--user">{MSG}</p>
            <p className="ba__msg ba__msg--bot">¡Sí! Enviamos a todo el país. A Mercedes llega en 3 a 5 días hábiles. ¿Te paso con el equipo para cerrar el pedido?</p>
            <p className="ba__time">23:47 · respondido en 4 segundos</p>
          </div>
          <p className="ba__result ba__result--ok">
            El cliente sigue por WhatsApp con <strong>toda la charla cargada</strong>.
          </p>
        </div>

        <div className="ba__handle" aria-hidden="true">
          <span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6-6 6 6 6" />
              <path d="m15 6 6 6-6 6" />
            </svg>
          </span>
        </div>

        <input
          className="ba__range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={e => setPos(Number(e.target.value))}
          aria-label="Comparar sin agente y con agente: arrastrá o usá las flechas"
        />
      </div>

      <ul className="ba__stats" aria-label="Resultados de ejemplo">
        <li>
          <strong>
            <CountUp value={10} suffix=" h" />
          </strong>
          <span>de espera en promedio, fuera de horario</span>
        </li>
        <li>
          <strong>
            <CountUp value={4} prefix="< " suffix=" s" duration={900} />
          </strong>
          <span>para responder con un agente</span>
        </li>
        <li>
          <strong>
            <CountUp value={24} suffix="/7" duration={1000} />
          </strong>
          <span>atención, todos los días del año</span>
        </li>
      </ul>
      <p className="ba__fine">Ejemplo ilustrativo: las cifras muestran el tipo de mejora que buscamos, no mediciones reales.</p>
    </div>
  );
}
