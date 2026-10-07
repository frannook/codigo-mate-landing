import Image from 'next/image';
import { ArrowRight, ArrowUp } from '@/components/icons';

const EMAIL = 'codigomatebot@gmail.com';

const LINKS: [string, string][] = [
  ['#probalo', 'Probalo'],
  ['#como', 'Cómo funciona'],
  ['#cotizador', 'Cotizador'],
  ['#testimonios', 'Clientes']
];

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__close">
        <h2 className="foot__title">
          Que tu web atienda mientras vos <em>tomás mate</em>.
        </h2>
        <div className="foot__act">
          <p className="foot__lead">Una videollamada de 30 minutos, sin costo y sin compromiso. O, si preferís, escribinos.</p>
          <div className="foot__ctas">
            <a href="#agendar" className="btn btn--solid">
              Agendar una llamada <ArrowRight />
            </a>
            <a href={`mailto:${EMAIL}`} className="foot__mail">
              {EMAIL}
            </a>
          </div>
        </div>
      </div>

      <div className="wrap foot__grid">
        <div className="foot__brand">
          <Image src="/logo-light.png" alt="Código Mate" width={1307} height={406} style={{ height: 32, width: 'auto' }} />
          <p>Agentes de IA que atienden a tus clientes desde tu web y te pasan a WhatsApp cuando hace falta.</p>
        </div>
        <nav className="foot__col" aria-label="Pie de página">
          <h3>Navegación</h3>
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="foot__col">
          <h3>Contacto</h3>
          <a href={`mailto:${EMAIL}`}>Escribinos por email</a>
          <a href="#agendar">Agendar una llamada</a>
          <a href="#probalo">Hablar con Mati, el agente</a>
        </div>
      </div>

      <div className="wrap foot__markwrap" data-reveal="mark">
        <p className="foot__mark" aria-hidden="true">
          <span>Código</span> <span>Mate</span>
        </p>
      </div>

      <div className="wrap foot__legal">
        <span>© 2026 Código Mate · Hecho en Argentina</span>
        <a href="#top" className="foot__top">
          Volver arriba <ArrowUp size={14} />
        </a>
      </div>
    </footer>
  );
}
