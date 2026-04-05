/** @type {import('next').NextConfig} */
const GATEWAY = process.env.API_GATEWAY_URL || 'http://localhost:3001';

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.gstatic.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${GATEWAY}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
