/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.pexels.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/img/**',
      },
    ],
  },
};

module.exports = nextConfig;
