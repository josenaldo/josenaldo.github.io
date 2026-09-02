// Corrige spec/03-paginas-internas.md §2 (tela `4b`). PageHeader com a fila
// de filtros como `children`, linhas de post (PostGrid/PostListItem já
// reescritos) e o disclaimer como nota de rodapé numa faixa `band` — nunca
// acima da lista.

import { getTranslations, setRequestLocale } from 'next-intl/server'

import BlogDisclaimer from '@/components/content/BlogDisclaimer'
import PostGrid from '@/components/content/PostGrid'
import PageHeader from '@/components/PageHeader'
import Section from '@/components/Section'
import CategoryFilters from '@/features/blog/CategoryFilters'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Blog' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `/${locale}/blog`,
            languages: {
                en: '/en/blog',
                pt: '/pt/blog',
            },
        },
    }
}

export default async function BlogPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: 'Blog' })

    const posts = contentService.getSortedPosts(locale).map((post) => ({
        title: post.title,
        description: post.description,
        url: post.url,
        image: post.image,
        date: post.date,
        category: post.category,
    }))

    const categories = contentService.getAllCategories(locale)

    return (
        <>
            <Section surface="default" padTop={56} padBottom={32}>
                <PageHeader
                    title={t('title')}
                    lead={t('description')}
                    leadWidth="70ch"
                >
                    <CategoryFilters
                        categories={categories}
                        allLabel={t('filterAll')}
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

            <Section surface="band" padTop={40} padBottom={40}>
                <BlogDisclaimer />
            </Section>
        </>
    )
}
