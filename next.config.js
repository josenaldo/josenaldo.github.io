const { withContentlayer } = require('next-contentlayer2');

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  assetPrefix: isProd ? '' : '',
  reactStrictMode: true,
  // Turbopack is now default in Next.js 16
  turbopack: {},
  images: {
    unoptimized: true,
    // Updated to remotePatterns (images.domains deprecated)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'josenaldo.github.io',
      },
      {
        protocol: 'https',
        hostname: 'josenaldo.com.br',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
}

module.exports = withContentlayer(nextConfig)
