// Preguntas frecuentes en acordeón nativo (<details>): funciona sin JavaScript y con teclado. En navegadores modernos abre una sola a la vez (name="faq").
// Las respuestas son del mismo tipo que las del chat y las de /servicios; no prometen precios ni plazos que el cotizador no muestre.
export const FAQS: [string, string][] = [
  [
    '¿Cuánto cuesta y cuánto tarda?',
    'Depende del rubro, del volumen de conversaciones y de las funciones que elijas. El cotizador de esta página te da un estimado en un minuto, y la primera charla de 30 minutos es sin costo.'
  ],
  [
    '¿Qué pasa si el agente no sabe una respuesta?',
    'No inventa. Te lo dice con claridad y pasa la conversación a tu WhatsApp con todo el contexto, para que una persona la retome sin hacerle repetir nada al cliente.'
  ],
  [
    '¿Funciona en mi plataforma?',
    'Sí: se instala con una línea de código en cualquier sitio, ya sea una tienda online, una web institucional o una página hecha a medida.'
  ],
  [
    '¿Habla como mi marca?',
    'Sí. Lo armamos con la información de tu negocio y con tu tono de voz: más cercano, más formal o como prefieras. Antes de publicarlo lo probamos con las preguntas que más te hacen.'
  ],
  [
    '¿Necesito saber programar?',
    'No. Vos nos contás cómo funciona tu negocio y nosotros nos encargamos de armarlo, instalarlo y mantenerlo al día.'
  ],
  [
    '¿Qué pasa con los datos de mis clientes?',
    'Los usamos solo para responder y coordinar. En la política de privacidad explicamos qué datos recibimos, para qué y cómo ejercer tus derechos. Y en el chat pedimos no escribir datos sensibles ni de tarjetas.'
  ],
  [
    '¿Los proyectos de ejemplo son reales?',
    'No: son proyectos simulados, creados para la materia Práctica Profesional I. Muestran cómo trabajaríamos con un negocio real.'
  ]
];

export default function Faq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
  };
  return (
    <>
      <div className="faq">
        {FAQS.map(([q, a]) => (
          <details key={q} className="faq__item" name="faq">
            <summary>
              <span>{q}</span>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
