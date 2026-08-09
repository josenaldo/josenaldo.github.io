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
    const page = contentService.getPageData(locale, 'resume')

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: `/${locale}/resume`,
            languages: {
                en: '/en/resume',
                pt: '/pt/resume',
            },
        },
    }
}

export default async function ResumePage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    const page = contentService.getPageData(locale, 'resume')

    return (
        <Container>
            <ContentView
                content={page.body.raw}
                title={page.title}
                description={page.description}
                url={page.url}
            />
        </Container>
    )
}
