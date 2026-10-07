'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import MotionToggle from '@/components/MotionToggle';
import { ArrowRight } from '@/components/icons';
import { motionOn } from '@/lib/motion';

const LINKS: [string, string][] = [
  ['probalo', 'Probalo'],
  ['como', 'Cómo funciona'],
  ['cotizador', 'Cotizador'],
  ['testimonios', 'Clientes']
];

// Barra flotante de vidrio: marca la sección visible con una pastilla que se desliza, se esconde al bajar
// y vuelve al subir (solo con movimiento activo). En pantallas chicas los links pasan a un panel.
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const linksRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Sección visible: la que cruza una franja en el medio de la pantalla.
  useEffect(() => {
    const els = LINKS.map(([id]) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
          else setActive(cur => (cur === e.target.id ? null : cur));
        }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Esconder al bajar, mostrar al subir.
  useEffect(() => {
    const motion = motionOn();
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 24);
      if (motion) {
        if (y < 120 || y - last < -6) setHidden(false);
        else if (y - last > 6) setHidden(true);
      }
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pastilla: se recorta (clip-path) sobre el link en hover o, si no, sobre el activo.
  const target = hover ?? active;
  useEffect(() => {
    const wrap = linksRef.current;
    const pill = pillRef.current;
    if (!wrap || !pill) return;
    const place = () => {
      const a = target && wrap.querySelector<HTMLElement>(`[data-id="${target}"]`);
      if (!a) {
        pill.style.opacity = '0';
        return;
      }
      const l = a.offsetLeft;
      const r = wrap.clientWidth - l - a.offsetWidth;
      pill.style.clipPath = `inset(0 ${r}px 0 ${l}px round 999px)`;
      pill.style.opacity = '1';
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [target]);

  // Panel móvil: Escape lo cierra y devuelve el foco al botón.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <header className="navp" data-hidden={hidden && !open} data-top={atTop} data-open={open}>
      <nav className="navp__bar" aria-label="Principal">
        <a href="#top" className="navp__brand" aria-label="Código Mate, inicio" onClick={() => setOpen(false)}>
          <Image src="/logo-light.png" alt="" width={1307} height={406} priority style={{ height: 30, width: 'auto' }} />
        </a>

        <div className="navp__links" ref={linksRef} onPointerLeave={() => setHover(null)}>
          <span className="navp__pill" ref={pillRef} aria-hidden="true" />
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              data-id={id}
              className="navp__link"
              aria-current={active === id ? 'location' : undefined}
              onPointerEnter={() => setHover(id)}
              onFocus={() => setHover(id)}
              onBlur={() => setHover(null)}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="navp__right">
          <MotionToggle />
          <a href="#agendar" className="nav__cta" onClick={() => setOpen(false)}>
            <span className="navp__cta-long">Agendar llamada</span>
            <span className="navp__cta-short">Agendar</span>
            <ArrowRight />
          </a>
          <button
            ref={burgerRef}
            type="button"
            className="navp__burger"
            aria-expanded={open}
            aria-controls="navp-sheet"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen(o => !o)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div id="navp-sheet" className="navp__sheet" aria-hidden={!open} inert={!open}>
        <ul>
          {LINKS.map(([id, label], i) => (
            <li key={id} style={{ '--i': i } as React.CSSProperties}>
              <a href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>
                {label}
                <ArrowRight size={20} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
