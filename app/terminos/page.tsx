import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Reveal from '@/components/Reveal';
import '../styles/about.css';
import '../styles/pages.css';
import '../styles/legal.css';

export const metadata: Metadata = {
  title: 'Términos y condiciones · Código Mate',
  alternates: { canonical: '/terminos' },
  description: 'Condiciones de uso del sitio de Código Mate: el chat con IA, el cotizador y el formulario de llamadas.'
};

const EMAIL = 'botcodigomate@gmail.com';

export default function Terminos() {
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
              <span>Información legal</span>
            </div>
            <h1 className="ab__title">Términos y condiciones</h1>
            <p className="lg__meta">Última actualización: 28 de octubre de 2026.</p>
          </div>

          <article className="lg">
            <p>Estos términos regulan el uso del sitio de Código Mate. Al usarlo aceptás estas condiciones. Si no estás de acuerdo, no uses el sitio.</p>

            <h2>Qué es este sitio</h2>
            <p>
              Presenta los servicios de Código Mate (agentes de IA para webs de negocios) y ofrece herramientas de muestra: un chat con un agente de IA, un
              cotizador y un formulario para pedir una llamada.
            </p>

            <h2>El chat con IA</h2>
            <ul>
              <li>Las respuestas las genera un modelo de inteligencia artificial y pueden contener errores. No son asesoramiento profesional.</li>
              <li>El chat no confirma precios, plazos ni condiciones de contratación: eso se acuerda en la llamada.</li>
              <li>No escribas datos sensibles, claves ni datos de tarjetas. Podemos limitar el uso para evitar abusos.</li>
            </ul>

            <h2>El cotizador y los precios</h2>
            <p>
              Las cifras del cotizador son una estimación orientativa y no una oferta. El precio final se define con cada cliente, por escrito, después de la
              llamada.
            </p>

            <h2>Pedido de llamada</h2>
            <p>
              Enviar el formulario es una solicitud. La llamada queda confirmada cuando te llega la confirmación por email o la invitación de calendario.
              Podemos reprogramarla avisándote con anticipación.
            </p>

            <h2>Uso permitido</h2>
            <p>
              No está permitido intentar vulnerar el servicio, automatizar consultas de forma abusiva, suplantar identidades ni usar el contenido de forma
              ilícita. Podemos bloquear accesos ante abusos.
            </p>

            <h2>Propiedad intelectual</h2>
            <p>
              Los textos, el diseño, el logo y el código del sitio son de Código Mate o de sus autores. No podés copiarlos ni usarlos con fines comerciales sin
              autorización.
            </p>

            <h2>Responsabilidad</h2>
            <p>
              Hacemos lo posible para que el sitio funcione de forma continua, pero puede haber interrupciones. En la medida que la ley lo permite, no
              respondemos por daños derivados del uso de las herramientas de muestra. Esto no limita los derechos que la normativa argentina de defensa del
              consumidor te reconoce.
            </p>

            <h2>Datos personales</h2>
            <p>
              El tratamiento de tus datos se explica en la <a href="/privacidad">política de privacidad</a>.
            </p>

            <h2>Cambios y ley aplicable</h2>
            <p>
              Podemos actualizar estos términos; la versión vigente siempre está publicada en esta página. Se rigen por las leyes de la República Argentina.
              Para consultas escribinos a <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
