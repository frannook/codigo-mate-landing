import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Hay otro package-lock.json en la carpeta de usuario; fija la raíz en este proyecto.
  turbopack: { root: process.cwd() }
};

export default nextConfig;
