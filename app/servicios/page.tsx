import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Reveal from '@/components/Reveal';
import { ArrowRight } from '@/components/icons';
import '../styles/about.css';
import '../styles/pages.css';

export const metadata: Metadata = {
  title: 'Servicios · Código Mate',
  alternates: { canonical: '/servicios' },
  description: 'Qué ofrece Código Mate: agentes de IA para webs de negocios, con seguimiento de pedidos, turnos, captura de contactos y pase a WhatsApp.'
};

// Cuatro servicios, una idea cada uno. Sin conversaciones de muestra: eso ya lo muestran Probalo y Proyectos.
const SERVICES: { title: string; text: string; who: string; items: string[] }[] = [
  {
    title: 'Atención 24 horas',
    text: 'Un agente en tu web que responde las dudas frecuentes con la información de tu negocio, a cualquier hora.',
    who: 'Tiendas, estudios, institutos y servicios técnicos',
    items: ['Se instala con una línea de código', 'Habla con tu tono de voz']
  },
  {
    title: 'Pedidos y logística',
    text: 'Se conecta a tu tienda o a tu sistema de envíos y responde el estado real de cada pedido.',
    who: 'Tiendas online y empresas de envíos',
    items: ['Consulta por número de pedido', 'Cobertura, tarifas y reclamos']
  },
  {
    title: 'Turnos y contactos',
    text: 'Ofrece horarios libres, toma turnos o reservas y guarda nombre, email y consulta en tu planilla o CRM.',
    who: 'Salud, gastronomía, educación y servicios profesionales',
    items: ['Agenda dentro de la charla', 'Contactos ya filtrados']
  },
  {
    title: 'Pase a una persona',
    text: 'Cuando la consulta lo requiere, la charla completa llega a tu WhatsApp para que nadie repita lo conversado.',
    who: 'Cualquier negocio que quiera atender sin sumar trabajo',
    items: ['Con todo el contexto de la charla', 'Incluido en todos los planes']
  }
];

export default function Servicios() {
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
              <span>Servicios</span>
            </div>
            <h1 className="ab__title">
              Lo que hacemos para que tu web <em className="accent">atienda sola</em>.
            </h1>
            <p className="ab__lead">
              Instalamos agentes de IA en sitios que ya existen. Cuatro servicios, según lo que necesite tu negocio.
            </p>
          </div>
          <ul className="pg__grid">
            {SERVICES.map(s => (
              <li key={s.title} className="pg__card" data-reveal="up">
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <p className="pg__for">
                  <strong>Para quién: </strong>
                  {s.who}
                </p>
                <ul className="pg__list">
                  {s.items.map(i => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="pg__cta">
            <a href="/#cotizador" className="btn btn--solid">
              Estimar el costo <ArrowRight />
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
