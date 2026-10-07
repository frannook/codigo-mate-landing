import Image from 'next/image';
import Booking from '@/components/Booking';
import ChatWidget from '@/components/ChatWidget';
import FocusChatLink from '@/components/FocusChatLink';
import Motion from '@/components/Motion';
import MotionToggle from '@/components/MotionToggle';
import Reveal from '@/components/Reveal';
import Steps from '@/components/Steps';
import Testimonials from '@/components/Testimonials';
import { ArrowRight } from '@/components/icons';

const HEADLINE: [string, number, boolean?][] = [
  ['Tu', 0.1],
  ['web', 0.17],
  ['ahora', 0.24],
  ['atiende', 0.36, true],
  ['a', 0.46],
  ['tus', 0.53],
  ['clientes.', 0.6]
];

const STRIP = ['Atención 24 horas', 'Seguimiento de pedidos', 'Pase a WhatsApp con contexto', 'Tu tono de voz', 'Una línea de código', 'Cualquier plataforma'];

const ASKS: [string, string][] = [
  ['Tengo una tienda online', 'Pedidos, envíos, cambios y pagos'],
  ['Hago envíos y logística', 'Seguimiento, cobertura y reclamos'],
  ['Tengo una web institucional', 'Servicios, horarios y contacto'],
  ['¿Qué pasa si no sabe responder?', 'Errores y pase a una persona'],
  ['¿Cuánto cuesta y cuánto tarda?', 'Precio, plazos y qué incluye']
];

function Logo({ height }: { height: number }) {
  return <Image src="/logo-light.png" alt="Código Mate" width={1307} height={406} style={{ height, width: 'auto' }} priority={height > 30} />;
}

export default function Home() {
  return (
    <>
      <Reveal />
      <Motion />
      <div className="top">
        <div aria-hidden="true" className="top__glow" />
        <div aria-hidden="true" className="top__grid" />

        <nav className="nav" aria-label="Principal">
          <div className="wrap nav__inner">
            <a href="#top" className="nav__brand" aria-label="Código Mate, inicio">
              <Logo height={36} />
            </a>
            <div className="nav__links only-wide">
              <a href="#probalo" className="nav__link">
                Probalo
              </a>
              <a href="#como" className="nav__link">
                Cómo trabajamos
              </a>
              <a href="#testimonios" className="nav__link">
                Clientes
              </a>
            </div>
            <div className="nav__right">
              <MotionToggle />
              <a href="#agendar" className="nav__cta">
                <span className="only-wide">Agendar una llamada</span>
                <span className="only-narrow">Agendar</span>
                <ArrowRight />
              </a>
            </div>
          </div>
        </nav>

        <header id="top" className="wrap hero">
          <div className="hero__copy">
            <div className="eyebrow">
              <span aria-hidden="true" className="eyebrow__rule" />
              <span>Agentes de IA para webs que ya existen</span>
            </div>
            <h1 className="hero__title" aria-label="Tu web ahora atiende a tus clientes.">
              {HEADLINE.map(([word, delay, em], i) => {
                const style = { animationDelay: `${delay}s`, ...(em ? { animationDuration: '1s' } : null) };
                return (
                  <span key={word} aria-hidden="true">
                    {i > 0 && ' '}
                    {em ? (
                      <em className="hero__word accent" style={style}>
                        {word}
                      </em>
                    ) : (
                      <span className="hero__word" style={style}>
                        {word}
                      </span>
                    )}
                  </span>
                );
              })}
            </h1>
            <p className="hero__lead">
              Sumamos un agente a tu sitio que responde dudas, sigue pedidos y resuelve problemas en el momento, las 24 horas. Cuando
              hace falta una persona, pasa la conversación a tu WhatsApp con todo el contexto.
            </p>
            <div className="hero__ctas">
              <a href="#agendar" className="btn btn--solid">
                Agendar una llamada <ArrowRight />
              </a>
              <FocusChatLink className="btn btn--ghost">Probar el agente</FocusChatLink>
            </div>
            <div className="hero__notes">
              <span>Se instala con una línea de código</span>
              <span>Funciona en cualquier plataforma</span>
            </div>
          </div>

          <div className="hero__visual">
            <ChatWidget showcase />
          </div>
        </header>
      </div>

      <div className="strip" aria-hidden="true">
        <div className="strip__track">
          {[0, 1].map(k => (
            <ul key={k} className="strip__list">
              {STRIP.map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <section id="probalo" className="section section--try">
        <div className="wrap section__inner try">
          <div data-reveal="left" className="try__intro">
            <h2 className="h2" data-headline>
              Preguntale lo que quieras. <em className="accent">Es de verdad.</em>
            </h2>
            <p className="lead">
              Mati es un agente real de Código Mate, igual al que instalamos en tu web. Reemplaza a las preguntas frecuentes: contale a qué te
              dedicás y resolvé todas tus dudas, de logística, ecommerce, webs institucionales y más.
            </p>
            <ul className="try__asks">
              {ASKS.map(([q, hint]) => (
                <li key={q}>
                  <FocusChatLink className="try__ask" prompt={q}>
                    <span>{q}</span>
                    <small>{hint}</small>
                    <ArrowRight />
                  </FocusChatLink>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="right">
            <ChatWidget />
          </div>
        </div>
      </section>

      <section className="section section--what">
        <div className="wrap section__inner what">
          <div data-reveal="up" className="what__head">
            <h2 className="h2" data-headline>
              Un empleado que no duerme, <em className="accent">sabe todo</em> y avisa cuando te necesita.
            </h2>
          </div>
          <div className="bento">
            <article data-reveal="up" data-spot className="tile tile--wide">
              <div className="tile__vis tile__vis--clock" aria-hidden="true">
                <span>24</span>
                <small>horas</small>
              </div>
              <h3>Atiende a cualquier hora</h3>
              <p>Dudas de precios, horarios, envíos y cambios. Respuestas al instante, de noche, domingos y feriados, con el tono de tu marca.</p>
            </article>
            <article data-reveal="up" data-spot className="tile">
              <div className="tile__vis tile__vis--track" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <h3>Sigue pedidos y resuelve</h3>
              <p>Consulta el estado, explica políticas y cierra el problema en la misma conversación.</p>
            </article>
            <article data-reveal="up" data-spot className="tile">
              <div className="tile__vis tile__vis--wa" aria-hidden="true">
                <span>Pasa a tu WhatsApp</span>
              </div>
              <h3>Te llama cuando hace falta</h3>
              <p>Si necesita una persona, te pasa la charla completa para que no repitas preguntas.</p>
            </article>
            <article data-reveal="up" data-spot className="tile tile--wide">
              <div className="tile__vis tile__vis--code" aria-hidden="true">
                <code>&lt;script src=&quot;codigomate.js&quot;&gt;</code>
              </div>
              <h3>Una línea de código y está en línea</h3>
              <p>Funciona en cualquier plataforma: tienda, sitio a medida o landing. Nosotros nos encargamos de la instalación.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="como" className="section section--how">
        <div className="wrap section__inner how">
          <div data-reveal="left" className="how__head">
            <h2 className="h2" data-headline>
              De la primera charla a tu agente <em className="accent">en línea</em>.
            </h2>
          </div>
          <Steps />
        </div>
      </section>

      <section id="testimonios" className="section section--proof">
        <div className="wrap section__inner proof">
          <div data-reveal="up" className="proof__head">
            <h2 className="h2" data-headline>
              Lo que cambia cuando tu web <em className="accent">responde sola</em>.
            </h2>
          </div>
          <div data-reveal="up">
            <Testimonials />
          </div>
        </div>
      </section>

      <section id="agendar" className="section section--book">
        <div className="wrap section__inner book">
          <div data-reveal="left" className="book__intro">
            <h2 className="h2" data-headline>
              Contanos de tu web y <em className="accent">tomemos un mate</em>.
            </h2>
            <p className="book__lead">
              30 minutos por videollamada. Revisamos tu sitio, las consultas que más recibís y te mostramos cómo quedaría tu agente.
            </p>
            <div className="book__notes">
              <span>Sin costo y sin compromiso</span>
              <span>Te confirmamos por email y WhatsApp</span>
            </div>
          </div>
          <div data-reveal="right" className="form-card">
            <Booking />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div data-reveal="up" className="wrap footer__inner">
          <div className="footer__brand">
            <Logo height={32} />
            <p>Agentes de IA que atienden a tus clientes desde tu web y te pasan a WhatsApp cuando hace falta.</p>
          </div>
          <nav className="footer__nav" aria-label="Pie de página">
            <a href="#probalo">Probalo</a>
            <a href="#como">Cómo trabajamos</a>
            <a href="#testimonios">Clientes</a>
            <a href="#agendar">Agendar una llamada</a>
          </nav>
          <a href="#agendar" className="btn btn--solid footer__cta">
            Agendar una llamada <ArrowRight />
          </a>
        </div>
        <div className="wrap footer__legal">© 2026 Código Mate · Hecho en Argentina</div>
      </footer>
    </>
  );
}
