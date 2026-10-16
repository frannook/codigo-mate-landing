import type { Metadata } from 'next';
import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Reveal from '@/components/Reveal';
import { ArrowRight } from '@/components/icons';
import '../styles/about.css';

export const metadata: Metadata = {
  title: 'Nosotros · Código Mate',
  description:
    'Somos Código Mate, una agencia argentina que instala agentes de IA en las webs de negocios. Conocé al equipo y cómo trabajamos.'
};

const PRINCIPLES: [string, string][] = [
  ['Hablamos claro', 'Sin tecnicismos ni promesas infladas: te explicamos qué hace el agente y qué no.'],
  ['Probamos antes de publicar', 'Lo armamos con tu información y lo ponemos a prueba con conversaciones reales.'],
  ['Siempre hay una persona', 'Si el agente no sabe algo, no lo inventa: pasa la charla a tu WhatsApp con todo el contexto.']
];

// La foto del equipo se pone en public/nosotros.jpg (o .webp / .png). Mientras no esté, se muestra el panel de marca.
function teamPhoto(): string | null {
  for (const ext of ['jpg', 'jpeg', 'webp', 'png']) {
    if (fs.existsSync(path.join(process.cwd(), 'public', `nosotros.${ext}`))) return `/nosotros.${ext}`;
  }
  return null;
}

export default function Nosotros() {
  const photo = teamPhoto();
  return (
    <>
      <Reveal />
      <Motion />
      <Nav />
      <main id="top" className="top ab">
        <div aria-hidden="true" className="top__glow" />
        <div aria-hidden="true" className="top__grid" />

        <div className="wrap ab__hero">
          <figure className="ab__photo">
            {photo ? (
              <Image src={photo} alt="El equipo de Código Mate" width={1200} height={1500} priority sizes="(min-width: 900px) 460px, 100vw" />
            ) : (
              <div className="ab__mark" role="img" aria-label="Código Mate">
                <Image src="/logo-color.png" alt="" width={1307} height={406} priority />
              </div>
            )}
          </figure>

          <div className="ab__copy">
            <div className="eyebrow">
              <span aria-hidden="true" className="eyebrow__rule" />
              <span>Nosotros</span>
            </div>
            <h1 className="ab__title">
              Detrás de cada agente hay un <em className="accent">equipo</em>.
            </h1>
            <p className="ab__lead">
              Somos Código Mate, una agencia argentina que instala agentes de IA en las webs de negocios. Trabajamos con dueños y
              responsables que quieren atender mejor a sus clientes sin sumar trabajo a su equipo.
            </p>
            <p className="ab__text">
              Cada agente se arma con la información de tu negocio, habla con tu tono de voz y se publica con una sola línea de código.
              Nos importa que se note que hay personas atrás.
            </p>
            <div className="ab__ctas">
              <a href="/#agendar" className="btn btn--solid">
                Agendar una llamada <ArrowRight />
              </a>
              <a href="/" className="btn btn--ghost">
                Volver al inicio
              </a>
            </div>
          </div>
        </div>

        <section className="wrap ab__values" aria-labelledby="ab-values">
          <h2 id="ab-values" className="h2" data-reveal="up">
            Cómo trabajamos
          </h2>
          <ul className="ab__list">
            {PRINCIPLES.map(([title, text]) => (
              <li key={title} data-reveal="up">
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
