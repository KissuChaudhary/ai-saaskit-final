/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      
    ],
    domains: ['fal.media', 'replicate.delivery'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
