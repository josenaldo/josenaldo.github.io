/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://josenaldo.com.br',
    outDir: 'out',
    generateRobotsTxt: true,
    // A raiz não é conteúdo: é a porta de entrada que detecta o idioma do
    // navegador e manda para `/en` ou `/pt` (ver `src/app/(root)/page.js`).
    // Quem indexa deve ir direto para a versão com locale — é o que as tags
    // `hreflang` apontam e o que `verify-alternates` confere.
    exclude: ['/'],
    // ...other options
}
