// Corrige spec/03-paginas-internas.md §8: derivada de `4b`. Mesma tela do
// /blog, três diferenças: h1 = nome da categoria, lead = contagem (ICU
// plural via Blog.category.postCount), pílula ativa em `tone="active"`, e
// sem disclaimer (ele fecha o índice geral, não um recorte).

import { getTranslations, setRequestLocale } from 'next-intl/server'

import PostGrid from '@/components/content/PostGrid'
import PageHeader from '@/components/PageHeader'
import Section from '@/components/Section'
import CategoryFilters from '@/features/blog/CategoryFilters'
import { routing } from '@/i18n/routing'
import { categoryLabel } from '@/lib/categoryLabel'
import contentService from '@/services/content'

export function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
        contentService.getAllCategories(locale).map((cat) => ({
            locale,
            slug: cat.slug,
        }))
    )
}

export async function generateMetadata({ params }) {
    const { locale, slug } = await params
    const categories = contentService.getAllCategories(locale)
    const category = categories.find((c) => c.slug === slug)
    const t = await getTranslations({ locale, namespace: 'Blog.category' })
    const tBlog = await getTranslations({ locale, namespace: 'Blog' })
    const categoryName = categoryLabel(tBlog, category?.name ?? slug)

    // Categoria não tem translationKey: o par entre locales só existe quando
    // o MESMO slug aparece nas categorias dos dois idiomas (hoje:
    // `job-market` e `personal`). Não inventar mapa de tradução aqui — onde
    // falta par (`architecture` x `engenharia-de-software`, por exemplo) é
    // porque o conteúdo ainda não foi traduzido, e isso se resolve
    // traduzindo, não no código.
    const otherLocale = routing.locales.find((l) => l !== locale)
    const otherLocaleCategories = otherLocale
        ? contentService.getAllCategories(otherLocale)
        : []
    const hasCounterpart = otherLocaleCategories.some((c) => c.slug === slug)

    return {
        title: t('detailTitle', { category: categoryName }),
        description: t('detailDescription', { category: categoryName }),
        alternates: {
            canonical: `/${locale}/blog/category/${slug}`,
            languages:
                hasCounterpart && otherLocale
                    ? { [otherLocale]: `/${otherLocale}/blog/category/${slug}` }
                    : undefined,
        },
    }
}

export default async function CategoryPage({ params }) {
    const { locale, slug } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: 'Blog.category' })
    const tBlog = await getTranslations({ locale, namespace: 'Blog' })

    const categories = contentService.getAllCategories(locale)
    const category = categories.find((c) => c.slug === slug)
    const categoryName = categoryLabel(tBlog, category?.name ?? slug)
    const postCount = category?.count ?? 0

    const posts = contentService
        .getPostsByCategory(locale, slug)
        .map((post) => ({
            title: post.title,
            description: post.description,
            url: post.url,
            image: post.image,
            date: post.date,
            category: post.category,
        }))

    return (
        <>
            <Section surface="default" padTop={56} padBottom={32}>
                <PageHeader
                    title={categoryName}
                    lead={t('postCount', { count: postCount })}
                >
                    <CategoryFilters
                        categories={categories}
                        activeSlug={slug}
                        allLabel={tBlog('filterAll')}
                        totalCount={categories.reduce(
                            (total, category) => total + category.count,
                            0
                        )}
                    />
                </PageHeader>
            </Section>

            <Section surface="default" padTop={0} padBottom={48}>
                <PostGrid posts={posts} />
            </Section>
        </>
    )
}
