/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para evitar problemas con rutas API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  }
};

module.exports = nextConfig;