const fs = require('fs')
const path = require('path')

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://josenaldo.com.br'

// Um feed por locale: cada um só com os posts do seu idioma, links já na
// árvore com prefixo de locale.
const LOCALE_FEEDS = [
    {
        locale: 'en',
        blogDir: path.join(process.cwd(), 'content', 'blog', 'en'),
        outputFile: path.join(process.cwd(), 'public', 'rss-en.xml'),
        selfPath: '/rss-en.xml',
        blogPath: '/en/blog',
        language: 'en',
    },
    {
        locale: 'pt',
        blogDir: path.join(process.cwd(), 'content', 'blog', 'pt'),
        outputFile: path.join(process.cwd(), 'public', 'rss-pt.xml'),
        selfPath: '/rss-pt.xml',
        blogPath: '/pt/blog',
        language: 'pt-BR',
    },
]

// Mesma regra de `isPublishedPost` em src/services/content.js. Repetida
// aqui porque este script roda em Node puro, fora do bundler, e não
// resolve o alias `@/` nem `contentlayer/generated` que o serviço importa.
// Se a regra mudar lá, muda aqui também.
const STATUS_ALIASES = {
    draft: 'draft',
    rascunho: 'draft',
    planned: 'planned',
    planejado: 'planned',
    published: 'published',
    publicado: 'published',
}

function normalizePostStatus(status) {
    const normalizedStatus = `${status || 'published'}`.trim().toLowerCase()

    return STATUS_ALIASES[normalizedStatus] || 'draft'
}

function isPublishedPost(post, now = new Date()) {
    return (
        normalizePostStatus(post.status) === 'published' &&
        new Date(post.date) <= now
    )
}

function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!match) return {}

    const yaml = match[1]
    const fields = {}

    yaml.split('\n').forEach((line) => {
        const colonIndex = line.indexOf(':')
        if (colonIndex === -1) return

        const key = line.slice(0, colonIndex).trim()
        let value = line.slice(colonIndex + 1).trim()
        value = value.replace(/^['"]|['"]$/g, '')
        fields[key] = value
    })

    return fields
}

function escapeXml(str) {
    return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

function readPublishedPosts(blogDir) {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'))

    return files
        .map((filename) => {
            const content = fs.readFileSync(
                path.join(blogDir, filename),
                'utf-8'
            )
            const fm = parseFrontmatter(content)
            const slug = filename.replace(/\.md$/, '')

            return {
                slug,
                title: fm.title || slug,
                description: fm.description || '',
                date: fm.date || new Date().toISOString(),
                status: fm.status || 'published',
                image: fm.image || '',
            }
        })
        .filter((post) => post.title)
        .filter((post) => isPublishedPost(post))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
}

// itemLinkPrefix é o que distingue um feed do outro: `/en/blog` e `/pt/blog`.
function generateRss(posts, { itemLinkPrefix, blogPath, selfPath, language }) {
    const items = posts
        .map((post) => {
            const link = `${SITE_URL}${itemLinkPrefix}/${post.slug}`
            const imageTag = post.image
                ? `\n      <enclosure url="${SITE_URL}${post.image}" type="image/jpeg" />`
                : ''

            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>${imageTag}
    </item>`
        })
        .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Josenaldo Matos — Blog</title>
    <link>${SITE_URL}${blogPath}</link>
    <description>Articles about software development, engineering, and career.</description>
    <language>${language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}${selfPath}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`
}

function main() {
    // O feed legado `/rss.xml` foi removido em 2026-08-09, por decisão do dono
    // do site. Ele linkava os posts em `/blog/<slug>`, formato que deixou de
    // existir quando os stubs das URLs antigas foram apagados na mesma decisão
    // — mantê-lo seria servir um feed cujos links todos dão 404. Ficam os dois
    // feeds por locale, `/rss-en.xml` e `/rss-pt.xml`.
    for (const feed of LOCALE_FEEDS) {
        const posts = readPublishedPosts(feed.blogDir)
        const rss = generateRss(posts, {
            itemLinkPrefix: `/${feed.locale}/blog`,
            blogPath: feed.blogPath,
            selfPath: feed.selfPath,
            language: feed.language,
        })
        fs.writeFileSync(feed.outputFile, rss, 'utf-8')
        console.log(
            `✓ RSS feed generated: ${feed.outputFile} (${posts.length} posts)`
        )
    }
}

main()
