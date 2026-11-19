// Proyectos de ejemplo (simulados, creados para la materia Práctica Profesional I). Los usan la lista /proyectos y el detalle /proyectos/[slug].
import type { SampleLine } from '@/components/ChatSample';

export type ProjectResult = { value: number; prefix?: string; suffix?: string; label: string };

export type Project = {
  slug: string;
  name: string;
  rubro: string;
  agent: string;
  before: string;
  after: string;
  demo: string;
  /** Captura (poster); el video tiene el mismo nombre con extensión .mp4. */
  img: string;
  alt: string;
  summary: string;
  problem: string[];
  solution: string[];
  results: ProjectResult[];
  sample: SampleLine[];
};

export const PROJECTS: Project[] = [
  {
    slug: 'el-ceibo',
    name: 'Almacén Natural "El Ceibo"',
    rubro: 'Tienda online',
    agent: 'Asistente de El Ceibo',
    before: 'Las mismas preguntas todos los días: si hacen envíos a tal ciudad, cuánto tarda y cómo se paga. Se contestaban a mano y fuera de horario se perdían ventas.',
    after: 'El agente vive en la tienda, responde envíos y plazos por localidad al instante y pasa a WhatsApp cuando el cliente quiere cerrar la compra.',
    demo: 'Probá preguntarle por un envío',
    img: '/proyectos/el-ceibo.jpg',
    alt: 'Tienda online de mates con el asistente virtual respondiendo sobre envíos a Mercedes, Corrientes',
    summary: 'Una tienda de yerba, mates y bombillas que vendía por la web pero atendía las dudas a mano, cuando podía.',
    problem: [
      'Casi todas las consultas eran las mismas: ¿hacen envíos a mi ciudad?, ¿cuánto tarda?, ¿cómo pago?',
      'Las respondía una sola persona, entre otras tareas, y de noche o los fines de semana quedaban sin contestar.',
      'Muchos clientes se iban de la tienda sin comprar mientras esperaban una respuesta.'
    ],
    solution: [
      'Un agente dentro de la tienda, con el tono cálido de la marca, que conoce los envíos, los plazos por localidad y los medios de pago.',
      'Responde en segundos, a cualquier hora, con la información real del negocio.',
      'Cuando el cliente quiere comprar o tiene un caso especial, pasa la charla a WhatsApp con todo el contexto para que la persona retome sin repreguntar.'
    ],
    results: [
      { value: 60, suffix: '%', label: 'menos consultas repetidas atendidas a mano' },
      { value: 5, prefix: '< ', suffix: ' s', label: 'para responder una consulta de envío' },
      { value: 24, suffix: '/7', label: 'atención, también de noche y fines de semana' }
    ],
    sample: [
      ['user', '¿Hacen envíos a Mercedes, Corrientes?'],
      ['bot', '¡Sí! Hacemos envíos a todo el país por Correo Argentino y OCA. A Mercedes llega en 3 a 5 días hábiles.'],
      ['user', 'Perfecto, quiero hacer un pedido.'],
      ['bot', 'Genial. Te paso con el equipo por WhatsApp para cerrarlo, con tu consulta ya cargada.']
    ]
  },
  {
    slug: 'distribucion-federal',
    name: 'Distribución Federal',
    rubro: 'Logística de envíos',
    agent: 'Asistente de Envíos',
    before: 'El equipo atendía llamadas y mensajes de "¿dónde está mi envío?" y no le quedaba tiempo para coordinar los repartos.',
    after: 'El cliente escribe su número de envío y el agente le dice dónde está y cuándo llega. Si pide cambiar el horario, lo deriva a un operador por WhatsApp.',
    demo: 'Probá con un número de envío',
    img: '/proyectos/distribucion-federal.jpg',
    alt: 'Panel de envíos con mapa de ruteo y el asistente de envíos informando el estado de un paquete',
    summary: 'Una distribuidora con cientos de envíos en tránsito por día y un equipo chico que pasaba el día respondiendo el mismo mensaje.',
    problem: [
      'Cada envío generaba, al menos, una consulta: ¿dónde está mi paquete?',
      'Los operadores dejaban de coordinar repartos para buscar el estado de cada número.',
      'En horas pico, los clientes esperaban y volvían a escribir, y la atención se acumulaba.'
    ],
    solution: [
      'Un asistente dentro del panel de seguimiento: el cliente escribe su número de envío y recibe el estado, la zona y la hora estimada de llegada.',
      'Si el paquete ya está en viaje y el cliente quiere cambiar el horario, el agente lo explica con claridad y lo deriva a un operador.',
      'El equipo recibe solo los casos que realmente necesitan a una persona.'
    ],
    results: [
      { value: 70, suffix: '%', label: 'de las consultas de seguimiento resueltas sin intervención' },
      { value: 3, prefix: '< ', suffix: ' s', label: 'para informar el estado de un envío' },
      { value: 2, suffix: ' h', label: 'por día que el equipo recupera para coordinar repartos' }
    ],
    sample: [
      ['user', 'Hola, quiero saber dónde está el envío 13258573S.'],
      ['bot', 'Tu pedido está en viaje. Salió a reparto en Buenos Aires y llega hoy antes de las 18:00 hs. El chofer es Carlos.'],
      ['user', 'Buenísimo, ¿puedo cambiar el horario de entrega?'],
      ['bot', 'Como el paquete ya está en viaje, no puedo modificarlo desde acá. Si no vas a estar, avisame y lo derivo a un operador.']
    ]
  },
  {
    slug: 'san-lucas',
    name: 'Consultorios Médicos San Lucas',
    rubro: 'Turnos online',
    agent: 'Asistente de San Lucas',
    before: 'Los turnos se coordinaban por teléfono, con idas y vueltas hasta encontrar un horario libre, y había ausencias sin aviso.',
    after: 'El agente propone un horario disponible, reserva el turno y envía la confirmación con el enlace de la videoconsulta. Las dudas pasan a WhatsApp.',
    demo: 'Probá agendar un turno',
    img: '/proyectos/san-lucas.jpg',
    alt: 'Sitio de consultorios con calendario de turnos y el asistente virtual confirmando un turno médico',
    summary: 'Un consultorio con varias especialidades que daba turnos solo por teléfono y en horario de oficina.',
    problem: [
      'Pedir un turno implicaba llamar, esperar y probar horarios hasta que alguno coincidiera.',
      'La recepción pasaba buena parte del día coordinando agenda en lugar de atender a los pacientes.',
      'Sin recordatorios claros, algunos turnos se perdían por ausencias.'
    ],
    solution: [
      'Un asistente junto al calendario de turnos: ofrece los horarios libres del profesional que el paciente elige.',
      'Al confirmar, reserva el turno y envía el detalle con el enlace de la videoconsulta.',
      'Si el paciente tiene una duda que no es de agenda, la charla pasa a WhatsApp con el contexto.'
    ],
    results: [
      { value: 45, suffix: '%', label: 'menos llamadas a recepción para pedir turno' },
      { value: 1, suffix: ' min', label: 'para reservar un turno, a cualquier hora' },
      { value: 100, suffix: '%', label: 'de los turnos confirmados con el enlace de la videoconsulta' }
    ],
    sample: [
      ['user', 'Hola, necesito un turno con el Dr. Martín Gómez para clínica médica.'],
      ['bot', '¡Perfecto! Tengo disponible el viernes 27 de noviembre a las 10:30 hs. ¿Te queda bien?'],
      ['user', 'Sí, me queda perfecto.'],
      ['bot', '¡Excelente! Ya reservé tu turno. Te envié la confirmación y el enlace de Google Meet a tu correo.']
    ]
  }
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find(p => p.slug === slug);
}
