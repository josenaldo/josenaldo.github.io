import { Box, Container } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import ContentTitle from '@/components/content/ContentTitle'
import PostGrid from '@/components/content/PostGrid'
import { routing } from '@/i18n/routing'
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
    const categoryName = category?.name ?? slug
    const t = await getTranslations({ locale, namespace: 'Blog.category' })

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

    const categories = contentService.getAllCategories(locale)
    const category = categories.find((c) => c.slug === slug)
    const categoryName = category?.name ?? slug

    const title = t('detailTitle', { category: categoryName })
    const description = t('detailDescription', { category: categoryName })

    const posts = contentService
        .getPostsByCategory(locale, slug)
        .map((post) => ({
            title: post.title,
            description: post.description,
            url: post.url,
            image: post.image,
            author: post.author,
            date: post.date,
            category: post.category,
            locale: post.locale,
        }))

    return (
        <Container>
            <Box sx={{ my: 5 }}>
                <ContentTitle title={title} subtitle={description} />
                <PostGrid posts={posts} />
            </Box>
        </Container>
    )
}
