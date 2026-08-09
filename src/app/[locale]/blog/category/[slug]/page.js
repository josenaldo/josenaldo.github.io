import { Box, Container } from '@mui/material'
import { setRequestLocale } from 'next-intl/server'

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

    const title = `Category: ${categoryName}`
    const description = `All posts in the "${categoryName}" category`

    return {
        title,
        description,
        alternates: {
            canonical: `/${locale}/blog/category/${slug}`,
            languages: {
                en: `/en/blog/category/${slug}`,
                pt: `/pt/blog/category/${slug}`,
            },
        },
    }
}

export default async function CategoryPage({ params }) {
    const { locale, slug } = await params
    setRequestLocale(locale)

    const categories = contentService.getAllCategories(locale)
    const category = categories.find((c) => c.slug === slug)
    const categoryName = category?.name ?? slug

    const title = `Category: ${categoryName}`
    const description = `All posts in the "${categoryName}" category`

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
