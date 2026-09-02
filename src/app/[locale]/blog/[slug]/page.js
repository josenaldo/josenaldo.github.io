import { notFound } from 'next/navigation'

import { Container } from '@mui/material'
import { setRequestLocale } from 'next-intl/server'

import ContentView from '@/components/content/ContentView'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    // Cruzar locale com os posts DAQUELE locale. O produto cartesiano geraria
    // rota para post que não existe em pt, e o export estático falharia.
    return routing.locales.flatMap((locale) =>
        contentService.getSortedPosts(locale).map((post) => ({
            locale,
            slug: post.slug,
        }))
    )
}

export async function generateMetadata({ params }) {
    const { locale, slug } = await params
    const post = contentService.getPostData(locale, slug)
    if (!post) return {}

    const sibling = contentService.getTranslationSibling(
        post,
        locale === 'en' ? 'pt' : 'en'
    )

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: post.url,
            languages: sibling ? { [sibling.locale]: sibling.url } : undefined,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            url: post.url,
            images: post.image ? [{ url: post.image }] : undefined,
        },
    }
}

export default async function BlogPostPage({ params }) {
    const { locale, slug } = await params
    setRequestLocale(locale)

    const post = contentService.getPostData(locale, slug)
    if (!post) notFound()

    return (
        <Container>
            <ContentView
                content={post.body.raw}
                title={post.title}
                description={post.description}
                image={post.image}
                date={post.date}
                author={post.author}
                category={post.category}
                url={post.url}
            />
        </Container>
    )
}
