import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Reveal from '@/components/Reveal';
import ChatSample, { type SampleLine } from '@/components/ChatSample';
import { ArrowRight } from '@/components/icons';
import '../styles/about.css';
import '../styles/pages.css';

export const metadata: Metadata = {
  title: 'Proyectos · Código Mate',
  alternates: { canonical: '/proyectos' },
  description: 'Ejemplos de agentes de IA de Código Mate. Son proyectos simulados, creados para la materia Práctica Profesional I.'
};

const PROJECTS: { name: string; rubro: string; agent: string; before: string; after: string; demo: string; sample: SampleLine[] }[] = [
  {
    name: 'Tienda de accesorios "Nube"',
    rubro: 'Tienda online',
    agent: 'Nube · Asistente',
    before: 'Decenas de mensajes cada mañana preguntando "¿dónde está mi pedido?" y por cambios.',
    after: 'El agente consulta el pedido por número, explica los cambios y pasa los reclamos a WhatsApp.',
    demo: 'Probalo con el pedido 4821',
    sample: [
      ['user', 'Quiero cambiar un talle.'],
      ['bot', 'Tenés 30 días para cambiarlo con la etiqueta puesta. ¿Me pasás el número de pedido?'],
      ['user', 'Es el 4821.'],
      ['bot', 'Está en camino, llega el jueves entre las 9 y las 13 h. Cuando lo recibas, te ayudo con el cambio.']
    ]
  },
  {
    name: 'Estudio contable "Ríos y Asociados"',
    rubro: 'Servicios profesionales',
    agent: 'Ríos y Asociados',
    before: 'Los posibles clientes no sabían qué documentación llevar ni a quién dirigirse.',
    after: 'El agente lista la documentación, toma nombre y consulta, y ofrece una llamada con un profesional.',
    demo: 'Probá agendar una llamada',
    sample: [
      ['user', '¿Qué documentación tengo que llevar?'],
      ['bot', 'Te paso la lista general: DNI, constancia de CUIT y tus últimos comprobantes. ¿Sos monotributista o responsable inscripto?'],
      ['user', 'Monotributo.'],
      ['bot', 'Perfecto. ¿Agendamos 30 minutos con un profesional del estudio para revisar tu caso?']
    ]
  }
];

export default function Proyectos() {
  return (
    <>
      <Reveal />
      <Motion />
      <Nav />
      <main id="top" className="top ab ambient">
        <div aria-hidden="true" className="top__glow" />
        <div aria-hidden="true" className="top__grid" />
        <div className="wrap">
          <div className="pg__head">
            <div className="eyebrow">
              <span aria-hidden="true" className="eyebrow__rule" />
              <span>Proyectos</span>
            </div>
            <h1 className="ab__title">
              Ejemplos de agentes <em className="accent">en acción</em>.
            </h1>
            <p className="ab__lead">Así trabajaríamos con un negocio real: el problema de todos los días y cómo lo resuelve el agente.</p>
            <p className="pg__note">Proyectos simulados, creados para la materia Práctica Profesional I. Los negocios no existen.</p>
          </div>
          <ol className="pj">
            {PROJECTS.map((p, i) => (
              <li key={p.name} className="pj__row">
                <div className="pj__text" data-reveal={i % 2 ? 'right' : 'left'}>
                  <span className="pj__rubro">
                    0{i + 1} · {p.rubro}
                  </span>
                  <h2 className="pj__name">{p.name}</h2>
                  <ul className="pj__ba">
                    <li className="pj__before">
                      <b>Antes</b>
                      <span>{p.before}</span>
                    </li>
                    <li className="pj__after">
                      <b>Ahora</b>
                      <span>{p.after}</span>
                    </li>
                  </ul>
                  <a href="/#probalo" className="pj__demo">
                    {p.demo} <ArrowRight size={14} />
                  </a>
                </div>
                <div className="pj__vis" data-reveal={i % 2 ? 'left' : 'right'}>
                  <div className="pj__phone depth-card" data-tilt="6">
                    <div className="pj__bar">
                      <span className={`avatar av-${i + 1}`} aria-hidden="true">
                        {p.agent[0]}
                      </span>
                      <span>
                        <strong>{p.agent}</strong>
                        <small>Agente de IA · en línea</small>
                      </span>
                    </div>
                    <ChatSample lines={p.sample} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="pj__end" data-reveal="up">
            <h2>
              ¿Tu negocio podría ser <em className="accent">el próximo</em>?
            </h2>
            <div className="pg__cta pj__ctas">
              <a href="/#agendar" className="btn btn--solid">
                Agendar una llamada <ArrowRight />
              </a>
              <a href="/#probalo" className="btn btn--ghost">
                Probar el agente
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
