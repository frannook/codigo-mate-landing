/*
 * PRECIOS DE EJEMPLO — EL EQUIPO DEBE CONFIRMARLOS ANTES DE PUBLICAR
 *
 * Todo el cotizador de la web sale de este archivo. Para cambiar un precio, editá el número y guardá.
 *  - "setup"   = implementación, pago único.
 *  - "monthly" = abono mensual.
 *  - Los montos van en la moneda de CURRENCY (sin puntos ni símbolos: 1500, no "US$ 1.500").
 *  - "monthly: null" en un volumen = se muestra "A medida" en vez de número.
 */

export const CURRENCY = { code: 'USD', locale: 'es-AR' };

// Implementación base: entrenar el agente con la info del negocio, probarlo e instalarlo en la web.
export const BASE_SETUP = 500;

export type BusinessId = 'tienda' | 'logistica' | 'institucional' | 'salud' | 'gastronomia' | 'educacion' | 'profesionales' | 'otro';
export type VolumeId = 'v500' | 'v2000' | 'v5000' | 'mas';
export type FeatureId = 'whatsapp' | 'pedidos' | 'turnos' | 'leads' | 'idiomas' | 'conocimiento' | 'reportes';
export type MaintenanceId = 'basico' | 'prioritario';

// Tipo de negocio: no cambia el precio. Cambia los ejemplos y qué funciones marcamos como "suele servir".
export const BUSINESSES: { id: BusinessId; label: string; examples: string[]; suggested: FeatureId[] }[] = [
  { id: 'tienda', label: 'Tienda online', examples: ['¿Dónde está mi pedido?', 'Cambios y devoluciones', 'Medios de pago y cuotas'], suggested: ['pedidos', 'conocimiento'] },
  { id: 'logistica', label: 'Logística y envíos', examples: ['Seguimiento por número', 'Cobertura y tarifas', 'Paquetes demorados'], suggested: ['pedidos', 'reportes'] },
  { id: 'institucional', label: 'Web institucional', examples: ['Servicios y horarios', 'Pedidos de presupuesto', 'Derivar al área correcta'], suggested: ['leads'] },
  { id: 'salud', label: 'Salud', examples: ['Horarios y profesionales', 'Obras sociales que atienden', 'Preparación para estudios'], suggested: ['turnos'] },
  { id: 'gastronomia', label: 'Gastronomía', examples: ['Menú y alérgenos', 'Reservas', 'Delivery y horarios'], suggested: ['turnos', 'idiomas'] },
  { id: 'educacion', label: 'Educación', examples: ['Programas y fechas', 'Requisitos de inscripción', 'Medios de pago'], suggested: ['leads', 'conocimiento'] },
  { id: 'profesionales', label: 'Servicios profesionales', examples: ['Primera orientación', 'Qué documentación llevar', 'Derivar al profesional'], suggested: ['leads', 'turnos'] },
  { id: 'otro', label: 'Otro rubro', examples: ['Las preguntas que más te repiten', 'Atención fuera de horario', 'Pase a una persona'], suggested: [] }
];

// Volumen de conversaciones por mes: define el abono base.
export const VOLUMES: { id: VolumeId; label: string; monthly: number | null }[] = [
  { id: 'v500', label: 'Hasta 500', monthly: 60 },
  { id: 'v2000', label: 'Hasta 2.000', monthly: 120 },
  { id: 'v5000', label: 'Hasta 5.000', monthly: 240 },
  { id: 'mas', label: 'Más de 5.000', monthly: null }
];

// Funciones. "included: true" = viene siempre y no se puede apagar.
export const FEATURES: { id: FeatureId; label: string; description: string; setup: number; monthly: number; included?: boolean }[] = [
  { id: 'whatsapp', label: 'Pase a WhatsApp con contexto', description: 'Si hace falta una persona, te llega la charla completa a tu WhatsApp.', setup: 0, monthly: 0, included: true },
  { id: 'pedidos', label: 'Seguimiento de pedidos', description: 'Se conecta a tu tienda y responde el estado real de cada pedido.', setup: 300, monthly: 20 },
  { id: 'turnos', label: 'Agenda de turnos y reservas', description: 'Ofrece horarios libres y toma turnos o reservas en la charla.', setup: 250, monthly: 20 },
  { id: 'leads', label: 'Captura de contactos', description: 'Guarda nombre, email y consulta en tu planilla o CRM.', setup: 150, monthly: 10 },
  { id: 'idiomas', label: 'Varios idiomas', description: 'Responde en el idioma de quien escribe.', setup: 150, monthly: 15 },
  { id: 'conocimiento', label: 'Base de conocimiento grande', description: 'Para catálogos extensos, manuales o muchos documentos.', setup: 200, monthly: 25 },
  { id: 'reportes', label: 'Reporte mensual', description: 'Qué preguntan, qué resolvió solo y qué pasó a una persona.', setup: 0, monthly: 30 }
];

// Mantenimiento: cuántas actualizaciones de información (precios, horarios, promos) incluye el abono.
export const MAINTENANCE: { id: MaintenanceId; label: string; detail: string; monthly: number }[] = [
  { id: 'basico', label: 'Básico', detail: 'Hasta 2 actualizaciones de información por mes.', monthly: 0 },
  { id: 'prioritario', label: 'Prioritario', detail: 'Hasta 8 actualizaciones por mes, con prioridad.', monthly: 40 }
];

// ---- De acá para abajo es la cuenta; no hace falta tocarlo para cambiar precios. ----

export type Selection = { business: BusinessId; volume: VolumeId; features: FeatureId[]; maintenance: MaintenanceId };

export const DEFAULT_SELECTION: Selection = { business: 'tienda', volume: 'v500', features: ['whatsapp'], maintenance: 'basico' };

const byId = <T extends { id: string }>(list: T[], id: string) => list.find(x => x.id === id) ?? list[0];

export function formatMoney(n: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, { style: 'currency', currency: CURRENCY.code, maximumFractionDigits: 0 }).format(n);
}

// monthly: null => a medida.
export function estimate(s: Selection): { setup: number; monthly: number | null } {
  const feats = FEATURES.filter(f => f.included || s.features.includes(f.id));
  const setup = BASE_SETUP + feats.reduce((t, f) => t + f.setup, 0);
  const base = byId(VOLUMES, s.volume).monthly;
  if (base === null) return { setup, monthly: null };
  return { setup, monthly: base + feats.reduce((t, f) => t + f.monthly, 0) + byId(MAINTENANCE, s.maintenance).monthly };
}

// Resumen en texto plano para mandar con el pedido de llamada.
export function summaryText(s: Selection): string {
  const { setup, monthly } = estimate(s);
    const feats = FEATURES.filter(f => f.included || s.features.includes(f.id)).map(f => f.label);
  return [
    'Presupuesto estimado desde la web',
    `Rubro: ${byId(BUSINESSES, s.business).label}`,
    `Volumen: ${byId(VOLUMES, s.volume).label} conversaciones por mes`,
    `Funciones: ${feats.join(', ')}`,
    `Mantenimiento: ${byId(MAINTENANCE, s.maintenance).label}`,
    `Implementación (pago único): ${formatMoney(setup)}`,
    `Abono mensual: ${monthly === null ? 'a medida' : formatMoney(monthly)}`,
    'Estimación orientativa: el precio final se define en la llamada.'
  ].join('\n');
}
