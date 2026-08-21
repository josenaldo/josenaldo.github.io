import { Box, Container, Typography } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import BookACallButton from '@/components/BookACallButton'
import ContentView from '@/components/content/ContentView'
import MDXContent from '@/components/content/MDXContent'
import Section from '@/components/Section'
import Evidence from '@/features/hiring/Evidence'
import ResumeDownloads from '@/features/hiring/ResumeDownloads'
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
    const terms = contentService.getPageData(locale, 'hiring-terms')
    const t = await getTranslations('Hiring.cta')

    return (
        <>
            <Container>
                <ContentView
                    content={page.body.raw}
                    title={page.title}
                    description={page.description}
                    image={page.image}
                    url={page.url}
                    showDisclaimer={false}
                />
            </Container>
            <Evidence />
            <Section elevation={0}>
                <MDXContent content={terms.body.raw} />
            </Section>
            <ResumeDownloads />
            <Section elevation={0}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                        maxWidth: 'md',
                        mx: 'auto',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h2">{t('title')}</Typography>
                    <BookACallButton />
                </Box>
            </Section>
        </>
    )
}
