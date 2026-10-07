import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif' });
const sans = Geist({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans' });
const mono = Geist_Mono({ subsets: ['latin'], weight: '400', variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Código Mate · Agentes de IA para tu web',
  description:
    'Sumamos un agente a tu sitio que responde dudas, sigue pedidos y resuelve problemas en el momento, las 24 horas. Cuando hace falta una persona, pasa la conversación a tu WhatsApp con todo el contexto.'
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
              "try{var d=document.documentElement,s=localStorage.getItem('cm-motion'),m=s||(matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on');d.dataset.motion=m;if(m==='on'&&'IntersectionObserver' in window)d.classList.add('reveal-on')}catch(e){}"
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
