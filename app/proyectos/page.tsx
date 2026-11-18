import type { Metadata } from 'next';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Reveal from '@/components/Reveal';
import { ArrowRight } from '@/components/icons';
import '../styles/about.css';
import '../styles/pages.css';

export const metadata: Metadata = {
  title: 'Proyectos · Código Mate',
  alternates: { canonical: '/proyectos' },
  description: 'Ejemplos de agentes de IA de Código Mate. Son proyectos simulados, creados para la materia Práctica Profesional I.'
};

const PROJECTS: { name: string; rubro: string; before: string; after: string; demo: string; img: string; alt: string }[] = [
  {
    name: 'Almacén Natural "El Ceibo"',
    rubro: 'Tienda online',
    before: 'Las mismas preguntas todos los días: si hacen envíos a tal ciudad, cuánto tarda y cómo se paga. Se contestaban a mano y fuera de horario se perdían ventas.',
    after: 'El agente vive en la tienda, responde envíos y plazos por localidad al instante y pasa a WhatsApp cuando el cliente quiere cerrar la compra.',
    demo: 'Probá preguntarle por un envío',
    img: '/proyectos/el-ceibo.jpg',
    alt: 'Tienda online de mates con el asistente virtual respondiendo sobre envíos a Mercedes, Corrientes'
  },
  {
    name: 'Distribución Federal',
    rubro: 'Logística de envíos',
    before: 'El equipo atendía llamadas y mensajes de "¿dónde está mi envío?" y no le quedaba tiempo para coordinar los repartos.',
    after: 'El cliente escribe su número de envío y el agente le dice dónde está y cuándo llega. Si pide cambiar el horario, lo deriva a un operador por WhatsApp.',
    demo: 'Probá con un número de envío',
    img: '/proyectos/distribucion-federal.jpg',
    alt: 'Panel de envíos con mapa de ruteo y el asistente de envíos informando el estado de un paquete'
  },
  {
    name: 'Consultorios Médicos San Lucas',
    rubro: 'Turnos online',
    before: 'Los turnos se coordinaban por teléfono, con idas y vueltas hasta encontrar un horario libre, y había ausencias sin aviso.',
    after: 'El agente propone un horario disponible, reserva el turno y envía la confirmación con el enlace de la videoconsulta. Las dudas pasan a WhatsApp.',
    demo: 'Probá agendar un turno',
    img: '/proyectos/san-lucas.jpg',
    alt: 'Sitio de consultorios con calendario de turnos y el asistente virtual confirmando un turno médico'
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
                  <figure className="pj__shot" data-tilt="5">
                    <Image src={p.img} alt={p.alt} width={1600} height={893} sizes="(min-width: 900px) 600px, 92vw" priority={i === 0} />
                  </figure>
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
