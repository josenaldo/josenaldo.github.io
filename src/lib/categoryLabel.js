import slugify from '@/shared/utils/slugify'

// O frontmatter guarda a categoria de forma inconsistente: em EN o campo tem o
// próprio slug (`job-market`), em PT convive `Engenharia de Software` com
// `opinião` e `personal`. Renderizar o campo cru produzia `JOB-MARKET` na
// pílula — o hífen aparecendo mesmo depois do `text-transform: uppercase`.
//
// A tradução acontece aqui, e não no conteúdo, por dois motivos: o rótulo
// exibido passa a poder diferir por idioma sem duplicar posts, e a URL
// continua saindo de `slugify(post.category)` — mexer no rótulo nunca quebra
// `/blog/category/<slug>`.
//
// `messages.Blog.categoryLabels.<slug>`. Categoria sem chave não quebra a
// página: cai no fallback, que troca hífen por espaço e sobe a primeira letra.

const prettify = (raw) => {
    const text = String(raw).replace(/[-_]+/g, ' ').trim()

    return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * @param {(key: string) => string & { has: (key: string) => boolean }} t
 *   tradutor do namespace `Blog` (useTranslations('Blog') ou getTranslations)
 * @param {string} category valor cru do frontmatter
 */
export const categoryLabel = (t, category) => {
    if (!category) return ''

    const key = `categoryLabels.${slugify(category)}`

    return t.has(key) ? t(key) : prettify(category)
}

export default categoryLabel
