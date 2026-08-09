import { execSync } from 'node:child_process'
import {
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    renameSync,
    writeFileSync,
} from 'node:fs'
import { join } from 'node:path'

// Coleções cujo conteúdo é escrito num idioma só e não se duplica: um post
// existe no idioma em que foi escrito, e a tradução, quando houver, é outro
// arquivo ligado por translationKey.
const SINGLE_LANGUAGE = ['blog']

// Coleções que hoje só existem em inglês. A árvore pt/ nasce como cópia
// marcada `translated: false`, para a Etapa 4 traduzir por cima.
const DUPLICATED = [
    'courses',
    'experiences',
    'projects',
    'services',
    'testimonials',
    'pages',
]

// Posts sem campo `language` no frontmatter, classificados à mão pela leitura
// do título e do corpo. Sem isto, o default do schema mandaria todos para en/.
const BLOG_LANGUAGE_OVERRIDES = {
    'ai-and-developers-another-brick-or-another-floor': 'en',
    'first-draft-programacao-orientada-a-gambiarra': 'pt',
    'interfaces-arent-villains': 'en',
    'learn-coding-is-not-hard': 'en',
    'por-que-ainda-sou-invisivel': 'pt',
    'return-of-the-jedi': 'en',
    'testes-typescript-suite-agil': 'pt',
    'why-am-i-still-invisible': 'en',
}

function frontmatterValue(raw, key) {
    const match = raw.match(new RegExp(`^${key}: *(.*)$`, 'm'))
    return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null
}

function isTracked(path) {
    try {
        execSync(`git ls-files --error-unmatch "${path}"`, { stdio: 'ignore' })
        return true
    } catch {
        return false
    }
}

function moveFile(from, to) {
    mkdirSync(to.split('/').slice(0, -1).join('/'), { recursive: true })

    // Arquivos ainda não versionados (ex: posts novos criados nesta sessão)
    // não podem ser movidos com `git mv` — cai para rename + add, sem
    // história de rename a preservar (o arquivo é novo de qualquer forma).
    if (isTracked(from)) {
        execSync(`git mv "${from}" "${to}"`)
    } else {
        renameSync(from, to)
        execSync(`git add "${to}"`)
    }
}

for (const collection of SINGLE_LANGUAGE) {
    const dir = join('content', collection)
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
        const slug = file.replace(/\.md$/, '')
        const raw = readFileSync(join(dir, file), 'utf8')
        const locale =
            frontmatterValue(raw, 'language') ||
            BLOG_LANGUAGE_OVERRIDES[slug] ||
            'en'
        moveFile(join(dir, file), join(dir, locale, file))
    }
}

for (const collection of DUPLICATED) {
    const dir = join('content', collection)
    if (!existsSync(dir)) continue
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
        moveFile(join(dir, file), join(dir, 'en', file))
        const raw = readFileSync(join(dir, 'en', file), 'utf8')
        const marked = raw.replace(/^---\n/, '---\ntranslated: false\n')
        mkdirSync(join(dir, 'pt'), { recursive: true })
        writeFileSync(join(dir, 'pt', file), marked)
        execSync(`git add "${join(dir, 'pt', file)}"`)
    }
}

console.log('conteúdo migrado')
