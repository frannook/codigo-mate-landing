import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import ProjectVideo from '@/components/ProjectVideo';
import Reveal from '@/components/Reveal';
import { ArrowRight } from '@/components/icons';
import { PROJECTS } from '@/lib/projects';
import '../styles/about.css';
import '../styles/pages.css';

export const metadata: Metadata = {
  title: 'Proyectos · Código Mate',
  alternates: { canonical: '/proyectos' },
  description: 'Ejemplos de agentes de IA de Código Mate. Son proyectos simulados, creados para la materia Práctica Profesional I.'
};

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
              <li key={p.slug} className="pj__row">
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
                  <div className="pj__links">
                    <a href={`/proyectos/${p.slug}`} className="pj__demo">
                      Ver el caso completo <ArrowRight size={14} />
                    </a>
                    <a href="/#probalo" className="pj__more">
                      {p.demo}
                    </a>
                  </div>
                </div>
                <div className="pj__vis" data-reveal={i % 2 ? 'left' : 'right'}>
                  <a href={`/proyectos/${p.slug}`} className="pj__shot-link" aria-label={`Ver el caso completo: ${p.name}`}>
                    <figure className="pj__shot" data-tilt="5">
                      <ProjectVideo img={p.img} alt={p.alt} />
                    </figure>
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <Footer />
    </>
  );
}
