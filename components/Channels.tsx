// Cinta de plataformas donde se instala el agente (nombres como texto, sin logos). Es decorativa: el párrafo oculto lo dice para lectores de pantalla.
const PLATFORMS = ['Tu web a medida', 'Tiendanube', 'Shopify', 'WordPress', 'WooCommerce', 'Wix', 'Webflow', 'WhatsApp'];

export default function Channels() {
  return (
    <section className="chan" aria-labelledby="chan-t">
      <h2 id="chan-t" className="sr-only">
        Dónde se instala
      </h2>
      <p className="sr-only">Se instala con una línea de código en tu web a medida, Tiendanube, Shopify, WordPress, WooCommerce, Wix y Webflow, y pasa las charlas a WhatsApp.</p>
      <p className="chan__label" aria-hidden="true">
        Se instala donde ya estás
      </p>
      <div className="chan__viewport" aria-hidden="true">
        <div className="chan__track">
          {[0, 1].map(k => (
            <ul key={k} className="chan__list">
              {PLATFORMS.map(p => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
