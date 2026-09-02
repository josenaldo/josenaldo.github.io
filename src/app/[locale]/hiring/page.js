// Corrige spec/03-paginas-internas.md §1 (tela `4a`). Layout completo:
// Bloco 1 (header 1fr 300px com card de currículo) → Bloco 2 (Evidence,
// StatCard) → Bloco 3 (spine "02 What I own") → Bloco 4 (CtaBlock).
//
// O lead do header usa `page.description` (a meta description curta), não o
// primeiro parágrafo do corpo — aquele é o texto solto sobre título/local/
// fuso que a nova estrutura de pílulas já cobre. O corpo de "O que eu
// assumo" vem do parágrafo depois do heading "## What I own" (mantém o
// `**negrito**` já escrito no Markdown). Os dois cards de marcador (Bloco 3)
// vêm dos dois parágrafos de content/pages/*/hiring-terms.md — o mesmo
// arquivo que antes virava uma seção de MDX genérica entre Evidence e o
// currículo.

import { Box, Typography } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import MDXContent from '@/components/content/MDXContent'
import CtaBlock from '@/components/CtaBlock'
import PageHeader from '@/components/PageHeader'
import Pill from '@/components/Pill'
import Section from '@/components/Section'
import SectionHeader from '@/components/SectionHeader'
import { BOOKING_URL } from '@/data/booking'
import Evidence from '@/features/hiring/Evidence'
import ResumeCard from '@/features/hiring/ResumeCard'
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

const splitParagraphs = (raw) =>
    raw
        .trim()
        .split(/\n\n+/)
        .map((paragraph) => paragraph.trim())

export default async function HiringPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    const page = contentService.getPageData(locale, 'hiring')
    const terms = contentService.getPageData(locale, 'hiring-terms')
    const t = await getTranslations('Hiring')
    const tCta = await getTranslations('Home.cta')
    const stack = t.raw('stack')

    const bodyParagraphs = splitParagraphs(page.body.raw)
    const headingIndex = bodyParagraphs.findIndex((p) => p.startsWith('## '))
    const ownBody =
        headingIndex >= 0
            ? bodyParagraphs.slice(headingIndex + 1).join('\n\n')
            : ''

    const termsParagraphs = splitParagraphs(terms.body.raw).filter(
        (p) => !p.startsWith('## ')
    )
    const ownershipMarker = termsParagraphs[0] ?? ''
    const asyncMarker = termsParagraphs[1] ?? ''

    const ctaProps = BOOKING_URL
        ? { href: BOOKING_URL, external: true }
        : { href: '/contact', external: false }

    return (
        <>
            <Section surface="default" padTop={64} padBottom={48}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '1fr 300px' },
                        gap: '56px',
                        alignItems: 'start',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                            }}
                        >
                            <Pill tone="amber">{t('status')}</Pill>
                            <Pill tone="neutral">{t('location')}</Pill>
                        </Box>

                        <PageHeader
                            title={page.title}
                            lead={page.description}
                            size="lg"
                        >
                            {stack.map((item) => (
                                <Pill key={item} tone="neutral" as="mono">
                                    {item}
                                </Pill>
                            ))}
                        </PageHeader>
                    </Box>

                    <ResumeCard />
                </Box>
            </Section>

            <Evidence />

            <Section surface="default" padTop={56} padBottom={56}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '340px 1fr' },
                        gap: { xs: '32px', lg: '56px' },
                        alignItems: 'start',
                    }}
                >
                    <SectionHeader n="02" title={t('ownTitle')} variant="spine" />

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            minWidth: 0,
                        }}
                    >
                        <Box
                            sx={{
                                '& p': {
                                    m: 0,
                                    fontSize: '18px',
                                    lineHeight: 1.7,
                                    color: '#D5DAE4',
                                    maxWidth: '72ch',
                                },
                                '& strong': {
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                },
                            }}
                        >
                            <MDXContent content={ownBody} />
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    md: '1fr 1fr',
                                },
                                gap: '16px',
                            }}
                        >
                            {[
                                { tag: t('own.ownershipTag'), text: ownershipMarker },
                                { tag: t('own.asyncTag'), text: asyncMarker },
                            ].map(({ tag, text }) => (
                                <Box
                                    key={tag}
                                    sx={{
                                        bgcolor: '#14181F',
                                        borderRadius: '16px',
                                        p: '22px 24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                    }}
                                >
                                    <Typography
                                        component="p"
                                        sx={{
                                            m: 0,
                                            fontFamily:
                                                "'IBM Plex Mono', ui-monospace, monospace",
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            letterSpacing: '.14em',
                                            textTransform: 'uppercase',
                                            color: '#8855DF',
                                        }}
                                    >
                                        {tag}
                                    </Typography>
                                    <Typography
                                        component="p"
                                        sx={{
                                            m: 0,
                                            fontSize: '15px',
                                            lineHeight: 1.6,
                                            color: '#C6CCD8',
                                        }}
                                    >
                                        {text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Section>

            <Section surface="default" padTop={40} padBottom={40} bleed>
                <CtaBlock
                    title={t('cta.title')}
                    ctaLabel={tCta('bookACall')}
                    {...ctaProps}
                />
            </Section>
        </>
    )
}
