// Corrige spec/03-paginas-internas.md §4 (tela `4d`). Coluna única — a
// única página onde a voz pessoal manda.
//
// O corpo (`page.body.raw`) é a carta em Markdown já existente. Dela saem
// dois blocos que a nova composição trata à parte, para não duplicar:
//  - a lista "two types of machines" vira os cards de marcador (spec: grid
//    1fr 1fr, tag roxa `Machine one`/`Machine two`) — texto vem de
//    `About.machines`, não do MDX, porque o card precisa da tag separada
//    do texto, que a lista em Markdown não tem;
//  - a despedida ("Sincerely, / Josenaldo / Software Developer & Kidney
//    Waster") vira o bloco de assinatura do header — mostrá-la de novo no
//    fim do corpo seria repetir a mesma informação duas vezes na página.
// A linha do tempo (`About.timeline`) é conteúdo sensível (doença,
// transplante) extraído da própria carta: mesmos fatos, frases curtas — ver
// nota da spec: "sem ícone, sem emoji, sem cor semântica: só o ano e o
// fato".

import { Box, Typography } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import photo200 from '@/assets/images/josenaldo-200.webp'
import MDXContent from '@/components/content/MDXContent'
import CtaBlock from '@/components/CtaBlock'
import Pill from '@/components/Pill'
import Section from '@/components/Section'
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
        openGraph: {
            title: page.title,
            description: page.description,
            url: `/${locale}/about`,
            images: page.image ? [{ url: page.image }] : undefined,
        },
    }
}

const splitParagraphs = (raw) =>
    raw
        .trim()
        .split(/\n\n+/)
        .map((paragraph) => paragraph.trim())

export default async function AboutPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    const page = contentService.getPageData(locale, 'about')
    const t = await getTranslations('About')
    const timeline = t.raw('timeline')

    const excluded = new Set(['Sincerely,', 'Josenaldo', t('role')])
    const allParagraphs = splitParagraphs(page.body.raw)

    // Os cards Machine one/two entram exatamente onde a lista de máquinas
    // estava no markdown — logo depois do parágrafo que os apresenta ("two
    // types of machines:"). Eles ficavam no fim da carta, a 2.000px do
    // parágrafo que os introduz, e ninguém ligava uma coisa à outra.
    const listIndex = allParagraphs.findIndex((p) => p.startsWith('- '))
    const keep = (p) => !p.startsWith('- ') && !excluded.has(p)
    const bodyBefore = (listIndex === -1
        ? allParagraphs
        : allParagraphs.slice(0, listIndex)
    ).filter(keep)
    const bodyAfter = (listIndex === -1
        ? []
        : allParagraphs.slice(listIndex)
    ).filter(keep)

    return (
        <>
            <Section surface="default" padTop={64} padBottom={40}>
                <Box
                    sx={{
                        maxWidth: '760px',
                        boxSizing: 'content-box',
                        mx: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    <Box sx={{ alignSelf: 'flex-start' }}>
                        <Pill
                            tone="amber"
                            size="sm"
                            uppercase
                            tracking=".14em"
                            sx={{ p: '7px 13px' }}
                        >
                            {t('kicker')}
                        </Pill>
                    </Box>

                    <Typography
                        component="h1"
                        sx={{
                            m: 0,
                            fontFamily: "'Space Grotesk', system-ui, sans-serif",
                            fontSize: '52px',
                            fontWeight: 700,
                            lineHeight: 1.08,
                            letterSpacing: '-.02em',
                            color: '#FFFFFF',
                        }}
                    >
                        {page.title}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <Box
                            component="img"
                            src={photo200.src}
                            alt=""
                            sx={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                flex: 'none',
                            }}
                        />
                        <Box>
                            <Typography
                                component="p"
                                sx={{ m: 0, fontSize: '15px', color: '#E9ECF2' }}
                            >
                                Josenaldo de Oliveira Matos Filho
                            </Typography>
                            <Typography
                                component="p"
                                sx={{
                                    m: 0,
                                    fontFamily:
                                        "'IBM Plex Mono', ui-monospace, monospace",
                                    fontSize: '12px',
                                    color: '#7C8494',
                                }}
                            >
                                {t('role')}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Section>

            <Section surface="default" padTop={0} padBottom={56}>
                <Box
                    sx={{
                        maxWidth: '680px',
                        boxSizing: 'content-box',
                        mx: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        fontSize: '19px',
                        lineHeight: 1.75,
                        color: '#D5DAE4',
                        '& > *': { m: 0 },
                    }}
                >
                    <MDXContent content={bodyBefore.join('\n\n')} />

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: '16px',
                        }}
                    >
                        {[
                            { tag: t('machines.oneTag'), text: t('machines.oneText') },
                            { tag: t('machines.twoTag'), text: t('machines.twoText') },
                        ].map(({ tag, text }) => (
                            <Box
                                key={tag}
                                sx={{
                                    bgcolor: '#14181F',
                                    borderRadius: '16px',
                                    p: '20px 22px',
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
                                        fontSize: '16px',
                                        lineHeight: 1.55,
                                        color: '#C6CCD8',
                                    }}
                                >
                                    {text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {bodyAfter.length > 0 ? (
                        <MDXContent content={bodyAfter.join('\n\n')} />
                    ) : null}
                </Box>
            </Section>

            <Section surface="default" padTop={24} padBottom={48}>
                <Box
                    sx={{
                        maxWidth: '900px',
                        boxSizing: 'content-box',
                        mx: 'auto',
                        bgcolor: '#0E1218',
                        borderRadius: '18px',
                        p: { xs: '24px', md: '32px 36px' },
                    }}
                >
                    <Typography
                        component="p"
                        sx={{
                            m: '0 0 8px',
                            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '.14em',
                            textTransform: 'uppercase',
                            color: '#FFAA00',
                        }}
                    >
                        {t('timelineTitle')}
                    </Typography>

                    {timeline.map((entry) => (
                        <Box
                            key={entry.year}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '78px 1fr',
                                gap: '20px',
                                p: '14px 0',
                                borderBottom: '1px solid rgba(255,255,255,.06)',
                            }}
                        >
                            <Typography
                                component="span"
                                sx={{
                                    fontFamily:
                                        "'IBM Plex Mono', ui-monospace, monospace",
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#FFAA00',
                                }}
                            >
                                {entry.year}
                            </Typography>
                            <Typography
                                component="span"
                                sx={{ fontSize: '16px', lineHeight: 1.6, color: '#C6CCD8' }}
                            >
                                {entry.text}
                            </Typography>
                        </Box>
                    ))}

                    <Typography
                        component="p"
                        sx={{
                            m: '16px 0 0',
                            fontFamily: "'Space Grotesk', system-ui, sans-serif",
                            fontSize: '20px',
                            fontWeight: 600,
                            lineHeight: 1.4,
                            color: '#FFFFFF',
                            maxWidth: '60ch',
                        }}
                    >
                        {t('timelineClosing')}
                    </Typography>
                </Box>
            </Section>

            <Section surface="default" padTop={40} padBottom={40} bleed>
                <CtaBlock
                    title={t('cta.title')}
                    ctaLabel={t('cta.ctaLabel')}
                    href="/contact"
                />
            </Section>
        </>
    )
}
