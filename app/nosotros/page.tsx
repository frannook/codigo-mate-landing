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
  alternates: { canonical: '/nosotros' },
  openGraph: { type: 'website', locale: 'es_AR', siteName: 'Código Mate', url: '/nosotros', title: 'Nosotros · Código Mate' },
  description:
    'Somos Código Mate, una agencia argentina que instala agentes de IA en las webs de negocios. Conocé al equipo y cómo trabajamos.'
};

const DEV = 'Técnico Superior en Desarrollo de Software';
const TEAM: [string, string][] = [
  ['Cristian Maciel', DEV],
  ['Luciano Beimundo', DEV],
  ['Matías Ortiz', DEV],
  ['Franco Romero', DEV],
  ['Elías Gómez Romero', 'Técnico Superior en Infraestructura']
];

// [título, explicación, ejemplo de cómo lo diría el agente]
const PRINCIPLES: [string, string, string][] = [
  ['Hablamos claro', 'Sin tecnicismos ni promesas infladas: te explicamos qué hace el agente y qué no.', '«Eso todavía no lo puede hacer, pero te muestro una alternativa.»'],
  ['Probamos antes de publicar', 'Lo armamos con tu información y lo ponemos a prueba con conversaciones reales.', '«Antes de salir, lo probamos con las preguntas que más te hacen.»'],
  ['Siempre hay una persona', 'Si el agente no sabe algo, no lo inventa: pasa la charla a tu WhatsApp con todo el contexto.', '«Eso lo ve mejor alguien del equipo. Te paso por WhatsApp.»']
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
          <div className="ab__photo-wrap" data-tilt="5">
            <figure className="ab__photo">
              {photo ? (
                <Image src={photo} alt="El equipo de Código Mate posando junto" width={1620} height={1620} priority quality={75} sizes="(min-width: 900px) 520px, 92vw" />
              ) : (
                <div className="ab__mark" role="img" aria-label="Código Mate">
                  <Image src="/logo-color.png" alt="" width={1307} height={406} sizes="(min-width: 900px) 300px, 60vw" priority />
                </div>
              )}
            </figure>
            <span className="ab__chip" aria-hidden="true">
              <i /> 5 personas · Hecho en Argentina
            </span>
          </div>

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
            <ul className="ab__stats" aria-label="Cómo empieza">
              <li>
                <strong>1 llamada</strong>
                <span>Para conocerte</span>
              </li>
              <li>
                <strong>30 min</strong>
                <span>Sin costo</span>
              </li>
              <li>
                <strong>1 línea</strong>
                <span>Para instalarlo</span>
              </li>
            </ul>
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

        <section className="wrap ab__values" aria-labelledby="ab-team">
          <h2 id="ab-team" className="h2" data-reveal="up">
            El <em className="accent">equipo</em>
          </h2>
          <ul className="ab__team">
            {TEAM.map(([name, role], i) => (
              <li key={name} data-reveal="up" className="depth-card" data-tilt="8" style={{ transitionDelay: `${i * 0.06}s` }}>
                <span className={`ab__ini av-${i % 6}`} aria-hidden="true">
                  {name
                    .split(' ')
                    .slice(0, 2)
                    .map(w => w[0])
                    .join('')}
                </span>
                <strong>{name}</strong>
                <span>{role}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="wrap ab__values" aria-labelledby="ab-values">
          <h2 id="ab-values" className="h2" data-reveal="up">
            Cómo trabajamos
          </h2>
          <ul className="ab__cards">
            {PRINCIPLES.map(([title, text, quote], i) => (
              <li key={title} data-reveal="up" className="depth-card" data-tilt="6">
                <em aria-hidden="true">0{i + 1}</em>
                <h3>{title}</h3>
                <p>{text}</p>
                <blockquote>{quote}</blockquote>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
