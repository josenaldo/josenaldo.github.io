import { Box, Container } from '@mui/material'
import { setRequestLocale } from 'next-intl/server'

import ContentTitle from '@/components/content/ContentTitle'
import PostGrid from '@/components/content/PostGrid'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

const title = 'Nephro Nerd Chronicles'
const description =
    "Explore Nephro Nerd Chronicles: Josenaldo's fusion of software development and kidney health insights. Be inspired, learn, and connect – one byte at a time!"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params

    return {
        title,
        description,
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
                <ContentTitle title={title} subtitle={description} />
                <PostGrid posts={posts} />
            </Box>
        </Container>
    )
}
