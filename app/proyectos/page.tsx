import type { Metadata } from 'next';
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

const PROJECTS: { name: string; rubro: string; problem: string; solution: string; result: string }[] = [
  {
    name: 'Tienda de accesorios "Nube"',
    rubro: 'Tienda online',
    problem: 'Cada mañana llegaban decenas de mensajes preguntando "¿dónde está mi pedido?" y por cambios y devoluciones.',
    solution: 'Un agente que consulta el estado del pedido por número, explica la política de cambios y pasa a WhatsApp los casos de reclamo.',
    result: 'Demo: los pedidos de ejemplo 4821, 4790 y 4833 se pueden consultar en el chat de Yuyo.'
  },
  {
    name: 'Estudio contable "Ríos y Asociados"',
    rubro: 'Servicios profesionales',
    problem: 'Los posibles clientes no sabían qué documentación llevar ni a qué profesional dirigirse.',
    solution: 'Un agente de primera orientación que lista la documentación, toma nombre y consulta, y ofrece turnos para una llamada.',
    result: 'Demo: el flujo de captura de contactos y la reserva de llamada del formulario de la home.'
  }
];

export default function Proyectos() {
  return (
    <>
      <Reveal />
      <Motion />
      <Nav />
      <main id="top" className="top ab">
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
            <p className="ab__lead">
              Estos proyectos son <strong>simulados</strong>: los creamos para la materia Práctica Profesional I y los negocios no existen. Muestran cómo
              trabajaríamos con un cliente real.
            </p>
          </div>
          <ul className="pg__grid">
            {PROJECTS.map(p => (
              <li key={p.name} className="pg__card" data-reveal="up">
                <span className="pg__tag">Proyecto simulado · {p.rubro}</span>
                <h2>{p.name}</h2>
                <p>
                  <strong>Problema: </strong>
                  {p.problem}
                </p>
                <p>
                  <strong>Solución: </strong>
                  {p.solution}
                </p>
                <p className="pg__for">{p.result}</p>
              </li>
            ))}
          </ul>
          <div className="pg__cta">
            <a href="/#probalo" className="btn btn--solid">
              Probar el agente <ArrowRight />
            </a>
            <a href="/#agendar" className="btn btn--ghost">
              Agendar una llamada
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
