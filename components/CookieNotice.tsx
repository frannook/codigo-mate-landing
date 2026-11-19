'use client';

import { useEffect, useState } from 'react';

const KEY = 'cm-aviso';

// Aviso de privacidad: cuenta qué guarda el sitio y se cierra con "Entendido" (se recuerda en el navegador).
// Si el navegador no deja guardar (modo privado), el aviso vuelve a aparecer en cada visita: es lo esperable.
export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const close = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* sin persistencia: se cierra solo por esta visita */
    }
  };

  if (!show) return null;
  return (
    <aside className="cn" role="region" aria-label="Aviso de privacidad">
      <p>
        Guardamos solo tu preferencia de fondo (claro u oscuro) y medimos las visitas sin cookies ni datos personales. <a href="/privacidad">Más información</a>
      </p>
      <button type="button" className="cn__btn" onClick={close}>
        Entendido
      </button>
    </aside>
  );
}
