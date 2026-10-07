import Booking from '@/components/Booking';
import ChatWidget from '@/components/ChatWidget';
import FocusChatLink from '@/components/FocusChatLink';
import Footer from '@/components/Footer';
import HeroShowcase from '@/components/HeroShowcase';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import NightStory from '@/components/NightStory';
import Quote from '@/components/Quote';
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

export default function Home() {
  return (
    <>
      <Reveal />
      <Motion />
      <Nav />
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
            <HeroShowcase />
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
              Yuyo es un agente real de Código Mate, igual al que instalamos en tu web. Reemplaza a las preguntas frecuentes: contale a qué te
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

      <NightStory />

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

      <Quote />

      <section id="agendar" className="section section--book ambient">
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
          <div data-reveal="right" className="glass glass--strong bk-card">
            <Booking />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
