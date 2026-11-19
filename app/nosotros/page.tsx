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
import '../styles/equipo.css';

export const metadata: Metadata = {
  title: 'Nosotros · Código Mate',
  alternates: { canonical: '/nosotros' },
  openGraph: { type: 'website', locale: 'es_AR', siteName: 'Código Mate', url: '/nosotros', title: 'Nosotros · Código Mate' },
  description:
    'Somos Código Mate, una agencia argentina que instala agentes de IA en las webs de negocios. Conocé al equipo y cómo trabajamos.'
};

const DEV = 'Técnico Superior en Desarrollo de Software';
const TEAM: { name: string; role: string; slug: string }[] = [
  { name: 'Cristian Maciel', role: DEV, slug: 'cristian-maciel' },
  { name: 'Luciano Deimundo', role: DEV, slug: 'luciano-deimundo' },
  { name: 'Matías Ortiz', role: DEV, slug: 'matias-ortiz' },
  { name: 'Franco Romero', role: DEV, slug: 'franco-romero' },
  { name: 'Elías Gómez Romero', role: 'Técnico Superior en Infraestructura', slug: 'elias-gomez-romero' }
];

// [título, explicación, ejemplo de cómo lo diría el agente]
const PRINCIPLES: [string, string, string][] = [
  ['Hablamos claro', 'Sin tecnicismos ni promesas infladas: te explicamos qué hace el agente y qué no.', '«Eso todavía no lo puede hacer, pero te muestro una alternativa.»'],
  ['Probamos antes de publicar', 'Lo armamos con tu información y lo ponemos a prueba con conversaciones reales.', '«Antes de salir, lo probamos con las preguntas que más te hacen.»'],
  ['Siempre hay una persona', 'Si el agente no sabe algo, no lo inventa: pasa la charla a tu WhatsApp con todo el contexto.', '«Eso lo ve mejor alguien del equipo. Te paso por WhatsApp.»']
];

// La foto de cada integrante se guarda en public/equipo/<slug>.png (ideal: fondo transparente, así se ve el logo detrás), .webp, .jpg o .jpeg.
// Mientras no esté el archivo, se muestran las iniciales sobre el fondo de marca.
function memberPhoto(slug: string): string | null {
  for (const ext of ['png', 'webp', 'jpg', 'jpeg']) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'equipo', `${slug}.${ext}`))) return `/equipo/${slug}.${ext}`;
  }
  return null;
}

export default function Nosotros() {
  return (
    <>
      <Reveal />
      <Motion />
      <Nav />
      <main id="top" className="top ab">
        <div aria-hidden="true" className="top__glow" />
        <div aria-hidden="true" className="top__grid" />

        <div className="wrap ab__hero">
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
          <div className="crew__head" data-reveal="up">
            <h2 id="ab-team" className="h2">
              El <em className="accent">equipo</em>
            </h2>
            <p className="crew__lead">Cinco personas detrás de cada agente. Hecho en Argentina.</p>
          </div>
          <ul className="crew">
            {TEAM.map((m, i) => {
              const photo = memberPhoto(m.slug);
              return (
                <li key={m.slug} data-reveal="up" className="crew__card depth-card" data-tilt="6" style={{ transitionDelay: `${i * 0.06}s` }}>
                  <div className="crew__photo">
                    <Image className="crew__mark logo-dark" src="/logo-color.png" alt="" width={1307} height={406} sizes="200px" />
                    <Image className="crew__mark logo-ink" src="/logo-ink.png" alt="" width={1307} height={406} sizes="200px" />
                    {photo ? (
                      <Image className="crew__img" src={photo} alt={`${m.name}, ${m.role}`} fill sizes="(min-width: 1000px) 220px, (min-width: 600px) 30vw, 46vw" quality={80} />
                    ) : (
                      <span className={`crew__ini av-${i % 6}`} role="img" aria-label={`${m.name}: foto pendiente`}>
                        {m.name
                          .split(' ')
                          .slice(0, 2)
                          .map(w => w[0])
                          .join('')}
                      </span>
                    )}
                  </div>
                  <strong>{m.name}</strong>
                  <span>{m.role}</span>
                </li>
              );
            })}
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
