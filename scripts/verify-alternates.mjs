import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

// Verificação da revisão final da etapa 1 (App Router + i18n): todo
// `<link rel="alternate" hrefLang="...">` anunciado num HTML exportado
// precisa apontar para um arquivo que de fato existe em `out/` — sem essa
// checagem, um par de idioma inventado (ex.: categoria sem tradução) só
// aparece como perda de posicionamento no Google semanas depois, nunca
// como build quebrado.
//
// Considera o formato flat do export (trailingSlash: false): `/en` vira
// `out/en.html`, `/en/about` vira `out/en/about.html`. O único stub que
// resta (`out/index.html`, gerado por `scripts/generate-root-redirect.mjs`)
// usa o formato `out/<rota>/index.html` — ambas as formas são aceitas.
const OUT_DIR = 'out'
const SITE_URL_CANDIDATES = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'https://josenaldo.com.br',
    'https://josenaldo.github.io',
]

function findHtmlFiles(dir) {
    const found = []
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        const stat = statSync(full)
        if (stat.isDirectory()) {
            found.push(...findHtmlFiles(full))
        } else if (extname(entry) === '.html') {
            found.push(full)
        }
    }
    return found
}

function stripSiteUrl(href) {
    for (const siteUrl of SITE_URL_CANDIDATES) {
        if (siteUrl && href.startsWith(siteUrl)) {
            return href.slice(siteUrl.length)
        }
    }
    // Já é um caminho relativo (começa com "/").
    if (href.startsWith('/')) return href
    return null
}

function pathToOutCandidates(pathname) {
    const trimmed = pathname.replace(/^\//, '').replace(/\/$/, '')
    if (trimmed === '') return [join(OUT_DIR, 'index.html')]
    return [
        // /en/about -> out/en/about.html (export flat, sem barra final)
        join(OUT_DIR, `${trimmed}.html`),
        // /en/about -> out/en/about/index.html (stub de redirect legado)
        join(OUT_DIR, trimmed, 'index.html'),
    ]
}

const htmlFiles = findHtmlFiles(OUT_DIR)
const alternates = []
const broken = []

for (const htmlFile of htmlFiles) {
    const content = readFileSync(htmlFile, 'utf-8')
    const linkRegex = /<link rel="alternate" hrefLang="[^"]+" href="([^"]+)"/g
    let match
    while ((match = linkRegex.exec(content)) !== null) {
        alternates.push({ htmlFile, href: match[1] })
    }
}

for (const { htmlFile, href } of alternates) {
    const pathname = stripSiteUrl(href)
    if (pathname === null) {
        broken.push(
            `${htmlFile} -> ${href} (não foi possível resolver domínio)`
        )
        continue
    }
    const candidates = pathToOutCandidates(pathname)
    const exists = candidates.some((candidate) => existsSync(candidate))
    if (!exists) {
        broken.push(
            `${htmlFile} -> ${href} (esperado um de: ${candidates.join(' ou ')}, nenhum existe)`
        )
    }
}

console.log(`arquivos html verificados: ${htmlFiles.length}`)
console.log(`tags hreflang encontradas: ${alternates.length}`)
if (broken.length > 0) {
    console.log(`QUEBRADOS ${broken.length}:`)
    broken.forEach((b) => console.log(`  - ${b}`))
    process.exit(1)
}
console.log(
    'ok: todas as tags hreflang apontam para arquivos existentes em out/'
)
