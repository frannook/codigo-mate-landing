// Mini conversación de ejemplo para tarjetas: muestra cómo respondería el agente, sin JavaScript ni datos reales.
export type SampleLine = ['user' | 'bot', string];

export default function ChatSample({ lines }: { lines: SampleLine[] }) {
  return (
    <figure className="pg__chat" aria-label="Ejemplo de conversación">
      <figcaption className="pg__chatlabel">Ejemplo de conversación</figcaption>
      {lines.map(([who, text], i) => (
        <p key={i} className={who === 'user' ? 'pg__msg pg__msg--user' : 'pg__msg pg__msg--bot'}>
          <span className="sr-only">{who === 'user' ? 'Cliente: ' : 'Agente: '}</span>
          {text}
        </p>
      ))}
    </figure>
  );
}
