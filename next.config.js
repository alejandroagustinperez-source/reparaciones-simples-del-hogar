/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      { source: '/herramientas', destination: '/', permanent: true },
      { source: '/herramientas/:path*', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
