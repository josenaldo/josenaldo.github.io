import { Box, Container } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import ContentTitle from '@/components/content/ContentTitle'
import PostGrid from '@/components/content/PostGrid'
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
        author: post.author,
        date: post.date,
        category: post.category,
        locale: post.locale,
    }))

    return (
        <Container>
            <Box
                sx={{
                    my: 5,
                }}
            >
                <ContentTitle title={t('title')} subtitle={t('description')} />
                <PostGrid posts={posts} />
            </Box>
        </Container>
    )
}
