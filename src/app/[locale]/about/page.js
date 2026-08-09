import { Container } from '@mui/material'
import { setRequestLocale } from 'next-intl/server'

import ContentView from '@/components/content/ContentView'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const page = contentService.getPageData(locale, 'about')

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: `/${locale}/about`,
            languages: {
                en: '/en/about',
                pt: '/pt/about',
            },
        },
    }
}

export default async function AboutPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    const page = contentService.getPageData(locale, 'about')

    return (
        <Container>
            <ContentView
                content={page.body.raw}
                title={page.title}
                description={page.description}
                image={page.image}
                url={page.url}
            />
        </Container>
    )
}
