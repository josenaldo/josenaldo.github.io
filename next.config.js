const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  assetPrefix: isProd ? '' : '',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
}

module.exports = withContentlayer(nextConfig)
