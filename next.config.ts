import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  // CSS dentro del HTML: se saca una ida y vuelta de red que bloquea el primer pintado.
  experimental: { inlineCss: true },
  // Hay otro package-lock.json en la carpeta de usuario; fija la raíz en este proyecto.
  turbopack: { root: process.cwd() }
};

export default nextConfig;
