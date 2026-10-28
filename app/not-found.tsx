import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Reveal from '@/components/Reveal';
import { ArrowRight } from '@/components/icons';
import '@/app/styles/about.css';
import '@/app/styles/pages.css';

export const metadata: Metadata = {
  title: 'Página no encontrada · Código Mate',
  robots: { index: false, follow: true }
};

export default function NotFound() {
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
              <span>Error 404</span>
            </div>
            <h1 className="ab__title">
              Esta página <em className="accent">no existe</em>.
            </h1>
            <p className="ab__lead">El enlace puede estar mal escrito o la página cambió de lugar. Podés volver al inicio o charlar con Yuyo, el agente.</p>
          </div>
          <div className="pg__cta">
            <a href="/" className="btn btn--solid">
              Volver al inicio <ArrowRight />
            </a>
            <a href="/#probalo" className="btn btn--ghost">
              Hablar con Yuyo
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
