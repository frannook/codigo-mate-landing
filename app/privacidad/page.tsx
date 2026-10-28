import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Reveal from '@/components/Reveal';
import { waLink } from '@/lib/site';
import '../styles/about.css';
import '../styles/pages.css';
import '../styles/legal.css';

export const metadata: Metadata = {
  title: 'Política de privacidad · Código Mate',
  alternates: { canonical: '/privacidad' },
  description: 'Qué datos recibe Código Mate cuando usás el chat, el cotizador o el formulario, para qué los usa, con quién los comparte y cómo ejercer tus derechos.'
};

const EMAIL = 'botcodigomate@gmail.com';

export default function Privacidad() {
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
            <h1 className="ab__title">Política de privacidad</h1>
            <p className="lg__meta">Última actualización: 28 de octubre de 2026.</p>
          </div>

          <article className="lg">
            <p>
              Esta política explica qué datos personales trata Código Mate cuando usás este sitio, para qué los usamos, con quién los compartimos y cómo
              podés ejercer tus derechos. Se aplica la Ley argentina 25.326 de Protección de los Datos Personales.
            </p>

            <h2>Quién es el responsable</h2>
            <p>
              Código Mate, agencia que instala agentes de IA en sitios web de negocios. Para cualquier consulta sobre tus datos escribinos a{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> o por <a href={waLink('Hola, tengo una consulta sobre mis datos personales.')}>WhatsApp</a>.
            </p>

            <h2>Qué datos recibimos y para qué</h2>
            <ul>
              <li>
                <strong>Formulario de la llamada:</strong> nombre, email, sitio web, rubro, día y horario elegidos y el mensaje que escribas. Los usamos
                para coordinar la llamada, enviarte la confirmación y la invitación de calendario y responder tu consulta.
              </li>
              <li>
                <strong>Chat con Yuyo:</strong> los mensajes que escribas. Se envían a un proveedor de inteligencia artificial para generar la respuesta. No
                pidas ni escribas en el chat datos sensibles, claves ni datos de tarjetas.
              </li>
              <li>
                <strong>Cotizador:</strong> las opciones que elegís. Si decidís enviarlas con el formulario, pasan a formar parte del mensaje.
              </li>
              <li>
                <strong>WhatsApp:</strong> si tocás un botón de WhatsApp, se abre la aplicación con un mensaje ya escrito. Lo que envíes desde ahí se rige por
                las condiciones de WhatsApp.
              </li>
              <li>
                <strong>Datos técnicos:</strong> dirección IP y datos básicos del navegador, para la seguridad, para limitar el uso abusivo del chat y del
                formulario y para medir visitas de forma agregada.
              </li>
            </ul>
            <p>No vendemos tus datos personales ni los usamos para publicidad de terceros.</p>

            <h2>Con quién los compartimos</h2>
            <p>Usamos proveedores que tratan los datos solo para prestar el servicio:</p>
            <ul>
              <li>Vercel, para alojar el sitio y medir visitas de forma agregada.</li>
              <li>Google, para el modelo de inteligencia artificial (Gemini), el envío de correos (Gmail) y la agenda de llamadas (Calendar y Meet).</li>
              <li>Otro proveedor de inteligencia artificial que puede actuar como respaldo si el principal no responde.</li>
              <li>Un servicio de almacenamiento temporal para contar los pedidos y evitar abusos.</li>
            </ul>
            <p>
              Algunos de estos proveedores están fuera de la Argentina. Al usar el chat y el formulario aceptás que tus datos se traten en sus servidores
              según sus propias condiciones y medidas de seguridad.
            </p>

            <h2>Cuánto tiempo los conservamos</h2>
            <p>
              Conservamos los datos el tiempo necesario para atender tu consulta y la relación comercial, y para cumplir obligaciones legales. Podés pedir que
              los eliminemos antes.
            </p>

            <h2>Tus derechos</h2>
            <p>
              Podés pedir acceso, rectificación, actualización o supresión de tus datos escribiendo a <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Respondemos en
              los plazos que fija la ley. La Agencia de Acceso a la Información Pública, como órgano de control de la Ley 25.326, atiende las denuncias y
              reclamos de quienes consideren vulnerados sus derechos.
            </p>

            <h2>Seguridad</h2>
            <p>
              Aplicamos medidas técnicas razonables: conexión cifrada, claves guardadas solo en el servidor, límites de uso y acceso restringido. Ningún
              sistema es infalible; si detectamos un incidente que te afecte, te avisaremos.
            </p>

            <h2>Cambios</h2>
            <p>Podemos actualizar esta política. La versión vigente siempre está publicada en esta página, con su fecha.</p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
