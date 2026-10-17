// Política de privacidade exigida pelo Google Cloud Console para o cliente
// OAuth "desktop app" do rclone (tela de consentimento → Branding). A URL
// registrada lá é `/en/google-privacy`.
//
// Só existe em inglês, de propósito: quem lê é o revisor do Google. Por isso
// `generateStaticParams` não devolve `pt`, e sem `alternates.languages` o
// site não anuncia um par em português que não existe.
//
// Não é linkada de lugar nenhum, fica fora do índice dos buscadores
// (`robots`) e do sitemap (`next-sitemap.config.js`).

import { Box, Typography } from '@mui/material'
import { setRequestLocale } from 'next-intl/server'

import MDXContent from '@/components/content/MDXContent'
import Section from '@/components/Section'
import contentService from '@/services/content'

export function generateStaticParams() {
    return [{ locale: 'en' }]
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const page = contentService.getPageData(locale, 'google-privacy')

    return {
        title: page.title,
        description: page.description,
        robots: { index: false, follow: false },
        alternates: { canonical: `/${locale}/google-privacy` },
    }
}

export default async function GooglePrivacyPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    const page = contentService.getPageData(locale, 'google-privacy')

    return (
        <Section surface="default" padTop={64} padBottom={56}>
            <Box
                sx={{
                    maxWidth: '680px',
                    boxSizing: 'content-box',
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    fontSize: '17px',
                    lineHeight: 1.7,
                    color: '#D5DAE4',
                    '& > *': { m: 0 },
                }}
            >
                <Typography
                    component="h1"
                    sx={{
                        m: 0,
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        fontSize: '44px',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: '-.02em',
                        color: '#FFFFFF',
                    }}
                >
                    {page.title}
                </Typography>
                <MDXContent content={page.body.raw} />
            </Box>
        </Section>
    )
}
