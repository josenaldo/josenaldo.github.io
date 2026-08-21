import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Por que a raiz é stub e não rota (conhecimento já perdido uma vez neste
// projeto — ver docs/superpowers/plans/2026-08-08-etapa-1-app-router-i18n.md):
// `output: 'export'` não roda middleware, então `next-intl` não pode
// detectar/redirecionar o locale em tempo de requisição. E `redirect('/en')`
// dentro de `app/page.js` produz uma página de erro (`__next_error__`) no
// export estático, não um redirect de fato. Sem stub em `out/index.html`,
// `https://josenaldo.com.br` (a raiz, sem prefixo de locale) devolve 404 —
// não é um "link antigo" preservado por nostalgia, é a porta de entrada do
// site.
//
// Decisão do dono do site em 2026-08-09: os stubs das URLs antigas
// (`/about`, `/blog/<slug>`, `/blog/category/<slug>`, `/projects/<slug>`
// etc., antes gerados por `scripts/generate-legacy-redirects.mjs`) foram
// removidos — não são mais necessários. Este script substitui aquele,
// mas gera só o stub da raiz.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://josenaldo.com.br'

// Sem barra final: `trailingSlash` é falso neste projeto, então o export
// gera `out/en.html`, servido em `/en`. Apontar para `/en/` faria o GitHub
// Pages procurar `out/en/index.html`, que não existe, e devolver 404.
const DESTINATION = '/en'

function stub(destination) {
    const absolute = `${SITE}${destination}`

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="${absolute}">
<meta http-equiv="refresh" content="0; url=${destination}">
<meta name="robots" content="noindex">
</head>
<body>
<p>This page has moved to <a href="${destination}">${absolute}</a>.</p>
</body>
</html>
`
}

writeFileSync(join('out', 'index.html'), stub(DESTINATION))

console.log(`stub da raiz gerado: out/index.html -> ${DESTINATION}`)
