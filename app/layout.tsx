import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import './styles/glass.css';
import './styles/nav-footer.css';
import './styles/testimonials.css';
import { Analytics } from '@vercel/analytics/next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, WHATSAPP_NUMBER } from '@/lib/site';

// Sin precarga: las fuentes no compiten con el CSS por el ancho de banda; el texto sale primero con una tipografía de respaldo ajustada.
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap', preload: false });
const sans = Geist({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans', display: 'swap', preload: false });
const mono = Geist_Mono({ subsets: ['latin'], weight: '400', variable: '--font-mono', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Código Mate · Agentes de IA para tu web', template: '%s' },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['chatbot para web', 'agente de IA', 'atención al cliente 24 horas', 'chatbot Argentina', 'WhatsApp', 'Código Mate'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: SITE_NAME,
    url: '/',
    title: 'Código Mate · Agentes de IA para tu web',
    description: SITE_DESCRIPTION
  },
  twitter: { card: 'summary_large_image', title: 'Código Mate · Agentes de IA para tu web', description: SITE_DESCRIPTION }
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-color.png`,
  description: SITE_DESCRIPTION,
  email: 'botcodigomate@gmail.com',
  telephone: `+${WHATSAPP_NUMBER}`,
  areaServed: 'AR',
  inLanguage: 'es-AR'
};

export const viewport: Viewport = { themeColor: '#0D1B2A' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Oculta los bloques con data-reveal antes del primer pintado (solo si hay JS y movimiento). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.dataset.motion='on';if('IntersectionObserver' in window)d.classList.add('reveal-on')"
          }}
        />
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <Analytics />
      </body>
    </html>
  );
}
