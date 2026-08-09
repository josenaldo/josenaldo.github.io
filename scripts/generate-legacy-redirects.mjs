import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { allPosts, allProjects } from '../.contentlayer/generated/index.mjs'

import { routing } from '../src/i18n/routing.js'
import slugify from '../src/shared/utils/slugify.js'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://josenaldo.com.br'

// Mesma regra de `isPublishedPost` em src/services/content.js. Duplicada aqui
// porque este script roda em Node puro, fora do bundler, e não resolve o alias
// `contentlayer/generated` que o serviço importa. Se a regra mudar lá, muda
// aqui — são os dois únicos lugares que decidem o que está no ar.
const STATUS_ALIASES = {
    draft: 'draft',
    rascunho: 'draft',
    planned: 'planned',
    planejado: 'planned',
    published: 'published',
    publicado: 'published',
}

const isPublished = (post, now = new Date()) => {
    const status =
        STATUS_ALIASES[`${post.status || 'published'}`.trim().toLowerCase()] ||
        'draft'
    return status === 'published' && new Date(post.date) <= now
}

const publishedPosts = allPosts.filter((post) => isPublished(post))

// Rotas que existiam antes da migração e o locale para onde cada uma vai.
// As páginas institucionais eram todas em inglês.
// Sem barra final: `trailingSlash` é falso neste projeto, então o export gera
// `out/en.html`, servido em `/en`. Apontar para `/en/` faria o GitHub Pages
// procurar `out/en/index.html`, que não existe — e devolver 404. Verificado no
// export da Task 4.
const STATIC_ROUTES = [
    ['', '/en'],
    ['about', '/en/about'],
    ['resume', '/en/resume'],
    ['contact', '/en/contact'],
    ['portfolio', '/en/portfolio'],
    ['blog', '/en/blog'],
    ['blog/category', '/en/blog/category'],
    ['courses', '/en/courses'],
    ['experiences', '/en/experiences'],
    ['projects', '/en/projects'],
    ['skills', '/en/skills'],
]

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

function write(routePath, destination) {
    const file = join('out', routePath, 'index.html')
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, stub(destination))
}

for (const [route, destination] of STATIC_ROUTES) {
    write(route, destination)
}

// O destino de cada post é o locale em que ele foi escrito — a maioria é pt.
// Só os publicados: rascunho não tem página no export, e stub para página
// inexistente é um redirect para 404.
for (const post of publishedPosts) {
    write(`blog/${post.slug}`, post.url)
}

// A rota antiga de categoria (`/blog/category/<slug>`) misturava posts dos
// dois idiomas. Agora cada categoria vive na árvore de um único locale: a que
// tiver mais posts publicados naquele slug de categoria, com empate indo para
// `routing.defaultLocale`. Derivado a partir dos posts publicados — nunca
// hardcoded — porque o resultado muda conforme posts saem do rascunho.
const categoryCountsBySlug = new Map()

for (const post of publishedPosts) {
    if (!post.category) continue
    const categorySlug = slugify(post.category)

    if (!categoryCountsBySlug.has(categorySlug)) {
        categoryCountsBySlug.set(categorySlug, new Map())
    }

    const countsByLocale = categoryCountsBySlug.get(categorySlug)
    countsByLocale.set(post.locale, (countsByLocale.get(post.locale) || 0) + 1)
}

for (const [categorySlug, countsByLocale] of categoryCountsBySlug) {
    let winningLocale = routing.defaultLocale
    let winningCount = countsByLocale.get(routing.defaultLocale) || 0

    for (const locale of routing.locales) {
        const count = countsByLocale.get(locale) || 0
        if (count > winningCount) {
            winningLocale = locale
            winningCount = count
        }
    }

    write(
        `blog/category/${categorySlug}`,
        `/${winningLocale}/blog/category/${categorySlug}`
    )
}

// Os slugs de projeto são idênticos nos dois idiomas (`content/projects/en/`
// e `content/projects/pt/` têm o mesmo conjunto de 11 slugs). O filtro abaixo
// não escolhe idioma — ele só desduplica, para não escrever o mesmo stub de
// rota duas vezes com o mesmo destino.
for (const project of allProjects.filter((p) => p.locale === 'en')) {
    write(`projects/${project.slug}`, project.url)
}

console.log(
    `stubs de redirect gerados: ${STATIC_ROUTES.length + publishedPosts.length + categoryCountsBySlug.size + allProjects.filter((p) => p.locale === 'en').length}`
)
