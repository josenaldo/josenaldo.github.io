const { withContentlayer } = require('next-contentlayer2');

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  assetPrefix: isProd ? '' : '',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'josenaldo.github.io', 'josenaldo.com.br'],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
}

module.exports = withContentlayer(nextConfig)
