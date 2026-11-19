'use client';

import { useEffect, useState } from 'react';

const KEY = 'cm-theme';

// El estado inicial lo fija el script de layout.tsx (elección guardada o, si no hay, la preferencia del sistema): se lee del atributo.
function readTheme(): 'dark' | 'light' {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

// Cambia entre fondo oscuro (navy) y claro (crema). El estado inicial lo fija el script de layout.tsx antes del primer pintado.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => setTheme(readTheme()), []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'light') document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* sin persistencia: el cambio vale para esta visita */
    }
  };

  const isLight = theme === 'light';
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isLight ? 'Cambiar a fondo oscuro' : 'Cambiar a fondo claro'}
      title={isLight ? 'Fondo oscuro' : 'Fondo claro'}
    >
      {isLight ? (
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}
