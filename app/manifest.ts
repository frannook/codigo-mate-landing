import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Código Mate · Agentes de IA para tu web',
    short_name: 'Código Mate',
    description: 'Agentes de IA que atienden a tus clientes desde tu web y te pasan a WhatsApp cuando hace falta.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1b2a',
    theme_color: '#0d1b2a',
    lang: 'es-AR',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}
