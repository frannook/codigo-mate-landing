import BeforeAfter from '@/components/BeforeAfter';
import Booking from '@/components/Booking';
import Faq from '@/components/Faq';
import ChatWidget from '@/components/ChatWidget';
import FocusChatLink from '@/components/FocusChatLink';
import Footer from '@/components/Footer';
import HeroIntro from '@/components/HeroIntro';
import HeroShowcase from '@/components/HeroShowcase';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import NightStory from '@/components/NightStory';
import OwnerPanel from '@/components/OwnerPanel';
import Quote from '@/components/Quote';
import Reveal from '@/components/Reveal';
import Steps from '@/components/Steps';
import Testimonials from '@/components/Testimonials';
import { ArrowRight } from '@/components/icons';
import { waLink } from '@/lib/site';

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
  ['¿Qué pasa si no sabe responder?', 'Errores y pase a una persona'],
  ['¿Cuánto cuesta y cuánto tarda?', 'Precio, plazos y qué incluye']
];

export default function Home() {
  return (
    <>
      <Reveal />
      <Motion />
      <Nav />
      <main>
      <HeroIntro />
      <div className="top">
        <div aria-hidden="true" className="top__glow" />
        <div aria-hidden="true" className="top__grid" />

        <header id="top" className="wrap hero">
          <div className="hero__copy">
            <div className="eyebrow">
              <span aria-hidden="true" className="eyebrow__rule" />
              <span>Agentes de IA para webs que ya existen</span>
            </div>
            <h1 className="hero__title" aria-label="Tu web ahora atiende a tus clientes.">
              {[HEADLINE.slice(0, 4), HEADLINE.slice(4)].map((group, g) => {
                const words = group.map(([word, delay, em], j) => {
                  const i = g === 0 ? j : j + 4;
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
                });
                // "a tus clientes." viaja junto: nunca queda una "a" sola al final de la línea.
                return g === 0 ? words : <span key="tail" style={{ whiteSpace: 'nowrap' }}>{words}</span>;
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
          </div>

          <div className="hero__visual">
            <div className="hero__stage" data-tilt="4">
              <HeroShowcase />
            </div>
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
            <div className="eyebrow">
              <span aria-hidden="true" className="eyebrow__rule" />
              <span>Probalo en vivo</span>
            </div>
            <h2 className="h2" data-headline>
              Preguntale lo que quieras. <em className="accent">Es de verdad.</em>
            </h2>
            <p className="lead">Yuyo es el mismo agente que instalamos en tu web. Contale a qué te dedicás y mirá cómo te ayudaría.</p>
            <p className="try__label">Probá con una de estas:</p>
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
          <div data-reveal="right" className="try__stage">
            <ChatWidget />
          </div>
        </div>
      </section>

      <NightStory />

      <section id="comparar" className="section section--ba">
        <div className="wrap section__inner sec">
          <div data-reveal="up" className="sec__head">
            <div className="eyebrow">
              <span aria-hidden="true" className="eyebrow__rule" />
              <span>La diferencia</span>
            </div>
            <h2 className="h2" data-headline>
              La misma consulta, <em className="accent">dos finales distintos</em>.
            </h2>
            <p className="lead">Arrastrá el control y mirá qué pasa a las 23:47 sin agente y con agente.</p>
          </div>
          <div data-reveal="up">
            <BeforeAfter />
          </div>
        </div>
      </section>

      <section id="como" className="section section--how">
        <div className="wrap section__inner how">
          <div data-reveal="left" className="how__head">
            <h2 className="h2" data-headline>
              De la primera charla a tu agente <em className="accent">en línea</em>.
            </h2>
            <p className="how__lead">Tres pasos. Vos nos contás cómo funciona tu negocio; del resto nos encargamos nosotros.</p>
          </div>
          <Steps />
        </div>
      </section>

      <section id="panel" className="section section--panel">
        <div className="wrap section__inner sec">
          <div data-reveal="up" className="sec__head">
            <div className="eyebrow">
              <span aria-hidden="true" className="eyebrow__rule" />
              <span>Para el dueño del negocio</span>
            </div>
            <h2 className="h2" data-headline>
              Vos ves todo lo que <em className="accent">pasa en tu web</em>.
            </h2>
            <p className="lead">Qué preguntan, a qué hora, qué resolvió el agente solo y qué pasó a una persona. Panel de ejemplo con datos ilustrativos.</p>
          </div>
          <div data-reveal="up">
            <OwnerPanel />
          </div>
        </div>
      </section>

      <section id="testimonios" className="section section--proof">
        <div className="wrap section__inner proof">
          <div data-reveal="up" className="proof__head">
            <h2 className="h2" data-headline>
              Lo que cambia cuando tu web <em className="accent">responde sola</em>.
            </h2>
            <p className="proof__note">
              Ejemplos ilustrativos de lo que cuentan los negocios que usan un agente. Los vamos a reemplazar por casos reales a medida que los tengamos.
            </p>
          </div>
          <div data-reveal="up">
            <Testimonials />
          </div>
        </div>
      </section>

      <Quote />

      <section id="faq" className="section section--faq">
        <div className="wrap section__inner sec sec--narrow">
          <div data-reveal="up" className="sec__head">
            <h2 className="h2" data-headline>
              Preguntas <em className="accent">frecuentes</em>.
            </h2>
          </div>
          <div data-reveal="up">
            <Faq />
          </div>
        </div>
      </section>

      <section id="agendar" className="section section--book ambient">
        <div className="wrap section__inner book">
          <div data-reveal="left" className="book__intro">
            <h2 className="h2" data-headline>
              Contanos de tu web y <em className="accent">tomemos un mate</em>.
            </h2>
            <p className="book__lead">
              30 minutos por videollamada. Revisamos tu sitio, las consultas que más recibís y te mostramos cómo quedaría tu agente.
            </p>
            <ul className="book__checks" aria-label="Qué incluye la charla">
              <li>Revisamos tu sitio y tus consultas más frecuentes</li>
              <li>Te mostramos cómo quedaría tu agente</li>
              <li>Sin costo y sin compromiso</li>
            </ul>
            <div className="book__notes">
              <span>Te confirmamos por email y WhatsApp</span>
              <a className="book__wa" href={waLink('Hola, quiero agendar una charla sobre un agente para mi web.')} target="_blank" rel="noopener">
                ¿Preferís escribir? Abrir WhatsApp <ArrowRight size={14} />
              </a>
            </div>
          </div>
          <div data-reveal="right" className="glass glass--strong bk-card">
            <Booking />
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}
