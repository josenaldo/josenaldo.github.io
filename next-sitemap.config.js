/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://josenaldo.github.io',
  output: 'export',
  outDir: 'out',
  generateRobotsTxt: true,
  // ...other options
}
