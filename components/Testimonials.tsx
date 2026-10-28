// TODO: textos de ejemplo. Reemplazar por testimonios reales (con permiso) antes de publicar.
type Item = { quote: string; name: string; role: string; chip: string };

const FEATURE: Item = {
  quote: 'Antes me despertaba con veinte mensajes preguntando por el envío. Ahora llegan solo los que de verdad necesitan a una persona.',
  name: 'Valentina R.',
  role: 'Tienda de accesorios',
  chip: 'Menos mensajes repetidos'
};

const ITEMS: Item[] = [
  {
    quote: 'Contesta como lo haríamos nosotros. Nadie nota que es un agente hasta que se lo cuento.',
    name: 'Martín G.',
    role: 'Estudio contable',
    chip: 'Habla como el estudio'
  },
  {
    quote: 'En una llamada entendieron mi negocio. Una semana después ya atendía clientes de noche y los domingos.',
    name: 'Camila S.',
    role: 'Cursos online',
    chip: 'Atiende también el domingo'
  },
  {
    quote: 'Cuando la consulta es compleja, me llega a WhatsApp con todo lo que ya conversaron.',
    name: 'Joaquín P.',
    role: 'Servicio técnico',
    chip: 'Derivación con contexto'
  }
];

const SECTORS = ['Tiendas online', 'Estudios', 'Inmobiliarias', 'Clínicas', 'Couriers', 'Restaurantes'];

const initials = (name: string) =>
  name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2);
const tone = (name: string) => [...name].reduce((n, c) => n + c.charCodeAt(0), 0) % 6;

function Who({ t }: { t: Item }) {
  return (
    <figcaption className="tm__who">
      <span className={`tm__avatar av-${tone(t.name)}`} aria-hidden="true">
        {initials(t.name)}
      </span>
      <span className="tm__id">
        <strong>{t.name}</strong>
        <span>{t.role}</span>
      </span>
    </figcaption>
  );
}

// Una cita destacada grande y tres chicas: se lee en un vistazo. (Antes era una cinta de 8 tarjetas.)
export default function Testimonials() {
  return (
    <div className="tm">
      <figure className="tm__feature">
        <span className="tm__mark" aria-hidden="true">“</span>
        <span className="tm__chip">{FEATURE.chip}</span>
        <blockquote className="tm__big">{FEATURE.quote}</blockquote>
        <Who t={FEATURE} />
      </figure>

      <div className="tm__grid">
        {ITEMS.map(t => (
          <figure key={t.name} className="tm__card">
            <blockquote className="tm__quote">{t.quote}</blockquote>
            <Who t={t} />
          </figure>
        ))}
      </div>

      <p className="tm__sectors">
        {SECTORS.map(s => (
          <span key={s}>{s}</span>
        ))}
      </p>
    </div>
  );
}
