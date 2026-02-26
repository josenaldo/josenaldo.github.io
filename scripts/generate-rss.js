const fs = require('fs')
const path = require('path')

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://josenaldo.com.br'
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'rss.xml')

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

function generateRss(posts) {
    const items = posts
        .map((post) => {
            const imageTag = post.image
                ? `\n      <enclosure url="${SITE_URL}${post.image}" type="image/jpeg" />`
                : ''

            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>${imageTag}
    </item>`
        })
        .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Josenaldo Matos — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Articles about software development, engineering, and career.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`
}

function main() {
    const files = fs
        .readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith('.md'))

    const posts = files
        .map((filename) => {
            const content = fs.readFileSync(
                path.join(BLOG_DIR, filename),
                'utf-8'
            )
            const fm = parseFrontmatter(content)
            const slug = filename.replace(/\.md$/, '')

            return {
                slug,
                title: fm.title || slug,
                description: fm.description || '',
                date: fm.date || new Date().toISOString(),
                image: fm.image || '',
            }
        })
        .filter((post) => post.title)
        .sort((a, b) => new Date(b.date) - new Date(a.date))

    const rss = generateRss(posts)
    fs.writeFileSync(OUTPUT_FILE, rss, 'utf-8')

    console.log(
        `✓ RSS feed generated: ${OUTPUT_FILE} (${posts.length} posts)`
    )
}

main()
