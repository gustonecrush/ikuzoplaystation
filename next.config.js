/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-ikuzo.v2.projequ.com',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
}

module.exports = nextConfig
