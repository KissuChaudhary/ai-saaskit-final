/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['fal.media', 'replicate.delivery'],
    unoptimized: true, // Add this for static exports if needed
  },
  // Ensure proper handling of API routes
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  // Keep your existing redirects
  async redirects() {
    return []
  },
  // Keep your existing rewrites
  async rewrites() {
    return []
  },
  // Add experimental features if needed
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

