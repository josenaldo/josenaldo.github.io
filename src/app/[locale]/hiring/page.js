import { Container } from '@mui/material'
import { setRequestLocale } from 'next-intl/server'

import ContentView from '@/components/content/ContentView'
import Evidence from '@/features/hiring/Evidence'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const page = contentService.getPageData(locale, 'hiring')

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: `/${locale}/hiring`,
            languages: {
                en: '/en/hiring',
                pt: '/pt/hiring',
            },
        },
        openGraph: {
            title: page.title,
            description: page.description,
            url: `/${locale}/hiring`,
            images: page.image ? [{ url: page.image }] : undefined,
        },
    }
}

export default async function HiringPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    const page = contentService.getPageData(locale, 'hiring')

    return (
        <>
            <Container>
                <ContentView
                    content={page.body.raw}
                    title={page.title}
                    description={page.description}
                    image={page.image}
                    url={page.url}
                />
            </Container>
            <Evidence />
        </>
    )
}
