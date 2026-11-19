import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChatSample from '@/components/ChatSample';
import CountUp from '@/components/CountUp';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import ProjectVideo from '@/components/ProjectVideo';
import Reveal from '@/components/Reveal';
import { ArrowRight } from '@/components/icons';
import { PROJECTS, getProject } from '@/lib/projects';
import '../../styles/about.css';
import '../../styles/pages.css';
import '../../styles/caso.css';

export function generateStaticParams() {
  return PROJECTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} · Proyectos · Código Mate`,
    alternates: { canonical: `/proyectos/${p.slug}` },
    description: `${p.summary} Proyecto simulado, creado para la materia Práctica Profesional I.`
  };
}

export default async function Proyecto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = PROJECTS.findIndex(x => x.slug === p.slug);
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  return (
    <>
      <Reveal />
      <Motion />
      <Nav />
      <main id="top" className="top ab ambient">
        <div aria-hidden="true" className="top__glow" />
        <div aria-hidden="true" className="top__grid" />
        <div className="wrap">
          <nav aria-label="Ubicación" className="cs__crumbs">
            <a href="/proyectos">Proyectos</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{p.name}</span>
          </nav>

          <div className="pg__head cs__head">
            <div className="eyebrow">
              <span aria-hidden="true" className="eyebrow__rule" />
              <span>
                0{i + 1} · {p.rubro}
              </span>
            </div>
            <h1 className="ab__title">{p.name}</h1>
            <p className="ab__lead">{p.summary}</p>
            <p className="pg__note">Proyecto simulado, creado para la materia Práctica Profesional I. El negocio no existe.</p>
          </div>

          <figure className="pj__shot cs__video" data-tilt="3" data-reveal="up">
            <ProjectVideo img={p.img} alt={p.alt} />
          </figure>

          <section className="cs__cols" aria-label="Problema y solución">
            <article className="cs__card" data-reveal="left">
              <span className="cs__tag cs__tag--before">Antes</span>
              <h2>El problema</h2>
              <ul>
                {p.problem.map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
            <article className="cs__card cs__card--after" data-reveal="right">
              <span className="cs__tag">Ahora</span>
              <h2>Lo que hicimos</h2>
              <ul>
                {p.solution.map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className="cs__results" aria-labelledby="cs-res" data-reveal="up">
            <h2 id="cs-res" className="cs__h">
              Resultados <em className="accent">de ejemplo</em>
            </h2>
            <ul className="cs__stats">
              {p.results.map(r => (
                <li key={r.label}>
                  <strong>
                    <CountUp value={r.value} prefix={r.prefix} suffix={r.suffix} />
                  </strong>
                  <span>{r.label}</span>
                </li>
              ))}
            </ul>
            <p className="cs__fine">Cifras ilustrativas del proyecto simulado: muestran el tipo de mejora que buscamos, no mediciones reales.</p>
          </section>

          <section className="cs__chat" aria-labelledby="cs-chat" data-reveal="up">
            <h2 id="cs-chat" className="cs__h">
              Así <em className="accent">conversa</em> el agente
            </h2>
            <ChatSample lines={p.sample} />
          </section>

          <div className="cs__nav" data-reveal="up">
            <a href={`/proyectos/${next.slug}`} className="cs__next">
              <span>Siguiente proyecto</span>
              <strong>{next.name}</strong>
              <ArrowRight />
            </a>
            <div className="pg__cta pj__ctas">
              <a href="/#agendar" className="btn btn--solid">
                Agendar una llamada <ArrowRight />
              </a>
              <a href="/#probalo" className="btn btn--ghost">
                {p.demo}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
