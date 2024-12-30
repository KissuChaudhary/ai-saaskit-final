/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['fal.media', 'replicate.delivery'],
  },
  async redirects() {
    return [
      // Add any necessary redirects here
    ]
  },
  async rewrites() {
    return [
      // Add any necessary rewrites here
    ]
  },
  // Add output configuration for static export if you're not using dynamic routes
  // output: 'export',
  // Add trailing slash configuration if needed
  // trailingSlash: true,
}

module.exports = nextConfig

