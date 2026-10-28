import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  // CSS dentro del HTML: se saca una ida y vuelta de red que bloquea el primer pintado.
  experimental: { inlineCss: true },
  // Cabeceras de seguridad básicas en todas las rutas. La Content-Security-Policy queda para más adelante (hay scripts en línea).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' }
        ]
      }
    ];
  },
  // Hay otro package-lock.json en la carpeta de usuario; fija la raíz en este proyecto.
  turbopack: { root: process.cwd() }
};

export default nextConfig;
