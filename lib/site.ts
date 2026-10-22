// Dirección pública del sitio. Al tener dominio propio: definir NEXT_PUBLIC_SITE_URL en Vercel (sin barra final).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://codigo-mate-landing.vercel.app').replace(/\/$/, '');
export const SITE_NAME = 'Código Mate';
export const SITE_DESCRIPTION =
  'Instalamos agentes de IA en la web de tu negocio: responden dudas, siguen pedidos y resuelven problemas las 24 horas, y pasan la charla a tu WhatsApp cuando hace falta una persona.';

// WhatsApp del negocio: código de país 54, el 9 de los celulares argentinos, característica (379) y número, todo junto y sin signos.
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5493794530578').replace(/\D/g, '');
export const waLink = (text?: string) => `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
