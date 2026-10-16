// Dirección pública del sitio. Al tener dominio propio: definir NEXT_PUBLIC_SITE_URL en Vercel (sin barra final).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://codigo-mate-landing.vercel.app').replace(/\/$/, '');
export const SITE_NAME = 'Código Mate';
export const SITE_DESCRIPTION =
  'Instalamos agentes de IA en la web de tu negocio: responden dudas, siguen pedidos y resuelven problemas las 24 horas, y pasan la charla a tu WhatsApp cuando hace falta una persona.';
