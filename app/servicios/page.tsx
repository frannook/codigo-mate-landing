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
  title: 'Servicios · Código Mate',
  alternates: { canonical: '/servicios' },
  description: 'Qué ofrece Código Mate: agentes de IA para webs de negocios, con seguimiento de pedidos, turnos, captura de contactos y pase a WhatsApp.'
};

const SERVICES: { title: string; text: string; who: string; items: string[]; sample: SampleLine[] }[] = [
  {
    title: 'Agente de atención 24 horas',
    text: 'Un agente de IA en tu web que responde las dudas frecuentes con la información de tu negocio, con tu tono de voz, a cualquier hora.',
    who: 'Negocios con muchas consultas repetidas: tiendas, estudios, institutos, servicios técnicos.',
    items: ['Se instala con una línea de código', 'Funciona en cualquier plataforma', 'No inventa precios ni plazos'],
    sample: [['user', '¿Hacen envíos a Salta?'], ['bot', 'Sí, enviamos a todo el país. El costo y el plazo dependen de tu código postal. ¿Me lo pasás?']]
  },
  {
    title: 'Seguimiento de pedidos y logística',
    text: 'El agente se conecta a tu tienda o sistema de envíos y responde el estado real de cada pedido.',
    who: 'Tiendas online y empresas de logística y envíos.',
    items: ['Consulta por número de pedido', 'Cobertura, tarifas y reclamos', 'Reporte mensual de lo que se preguntó'],
    sample: [['user', '¿Dónde está mi pedido 4821?'], ['bot', 'Va en camino y llega el jueves entre las 9 y las 13 h.']]
  },
  {
    title: 'Turnos, reservas y captura de contactos',
    text: 'Ofrece horarios libres, toma turnos o reservas y guarda nombre, email y consulta en tu planilla o CRM.',
    who: 'Salud, gastronomía, educación y servicios profesionales.',
    items: ['Agenda en la misma charla', 'Contactos ya filtrados', 'Varios idiomas si hace falta'],
    sample: [['user', 'Quiero un turno para el viernes.'], ['bot', 'El viernes tengo libres 10:00 y 15:30. ¿Cuál te sirve?']]
  },
  {
    title: 'Pase a una persona por WhatsApp',
    text: 'Cuando la consulta lo requiere, la charla completa llega a tu WhatsApp para que nadie repita lo ya conversado.',
    who: 'Cualquier negocio que quiera atender mejor sin sumar trabajo a su equipo.',
    items: ['Incluido en todos los planes', 'Con todo el contexto de la charla', 'El agente avisa cuando no sabe'],
    sample: [['user', 'Necesito cambiar la dirección de entrega.'], ['bot', 'Eso lo resuelve una persona del equipo. Te paso por WhatsApp con el resumen de tu pedido.']]
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
              Armamos e instalamos agentes de IA en sitios que ya existen. Cada servicio explica qué incluye y a quién está dirigido.
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
                <ChatSample lines={s.sample} />
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
