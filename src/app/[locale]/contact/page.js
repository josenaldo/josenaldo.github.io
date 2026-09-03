// Corrige spec/03-paginas-internas.md §7 (tela `4g`). Grid 1fr/420px: à
// esquerda a ação principal (h1, lead, botão + e-mail, grid de canais,
// nota de fuso); à direita o card do GitHub, que "deixa de competir" com o
// CTA — superfície `band` (não `paper`), botão neutro (não roxo).
//
// `socialLinks` já tem exatamente os quatro canais que a spec pede
// (LinkedIn/GitHub/Email/WhatsApp) — nenhum dado novo precisou ser criado.

import { Box, Typography } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import BookACallButton from '@/components/BookACallButton'
import Section from '@/components/Section'
import socialLinks from '@/data/socialLinks'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Contact' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `/${locale}/contact`,
            languages: {
                en: '/en/contact',
                pt: '/pt/contact',
            },
        },
    }
}

export default async function ContactPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: 'Contact' })

    return (
        <Section surface="default" padTop={64} padBottom={48}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 420px' },
                    gap: '56px',
                    alignItems: 'start',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '22px',
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            m: 0,
                            fontFamily:
                                "'Space Grotesk', system-ui, sans-serif",
                            fontSize: '48px',
                            fontWeight: 700,
                            lineHeight: 1.08,
                            letterSpacing: '-.02em',
                            maxWidth: '22ch',
                            color: '#FFFFFF',
                        }}
                    >
                        {t('title')}
                    </Typography>

                    <Typography
                        component="p"
                        sx={{
                            m: 0,
                            fontSize: '19px',
                            lineHeight: 1.6,
                            color: '#C6CCD8',
                            maxWidth: '60ch',
                        }}
                    >
                        {t('description')}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '20px',
                        }}
                    >
                        {/* Só a ação primária aqui. O e-mail ficava ao lado
                        do botão E de novo no card EMAIL logo abaixo, na mesma
                        dobra — duas vezes o mesmo endereço, competindo com a
                        chamada de 30 minutos que a página nomeia como o
                        caminho mais rápido. */}
                        <BookACallButton />
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: '12px',
                        }}
                    >
                        {socialLinks.map((social) => (
                            <Box
                                key={social.name}
                                component="a"
                                href={social.url}
                                target={
                                    social.url.startsWith('http')
                                        ? '_blank'
                                        : undefined
                                }
                                rel={
                                    social.url.startsWith('http')
                                        ? 'noopener noreferrer'
                                        : undefined
                                }
                                sx={{
                                    bgcolor: '#14181F',
                                    borderRadius: '14px',
                                    p: '18px 20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                    textDecoration: 'none',
                                }}
                            >
                                <Typography
                                    component="span"
                                    sx={{
                                        fontFamily:
                                            "'IBM Plex Mono', ui-monospace, monospace",
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        letterSpacing: '.14em',
                                        textTransform: 'uppercase',
                                        color: '#FFAA00',
                                    }}
                                >
                                    {social.name}
                                </Typography>
                                <Typography
                                    component="span"
                                    sx={{ fontSize: '15px', color: '#C6CCD8' }}
                                >
                                    {social.valueKey
                                        ? t(social.valueKey)
                                        : social.value}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

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
                        {t('timezoneNote')}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        bgcolor: '#0E1218',
                        borderRadius: '18px',
                        p: '28px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
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
                            color: '#98A0B0',
                        }}
                    >
                        {t('githubCard.title')}
                    </Typography>
                    <Typography
                        component="p"
                        sx={{
                            m: 0,
                            fontSize: '15px',
                            lineHeight: 1.6,
                            color: '#98A0B0',
                        }}
                    >
                        {t('githubCard.body')}
                    </Typography>
                    <Box
                        component="a"
                        href="https://github.com/josenaldo/josenaldo.github.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            alignSelf: 'flex-start',
                            fontSize: '14px',
                            color: '#C6CCD8',
                            bgcolor: 'rgba(255,255,255,.06)',
                            borderRadius: '10px',
                            px: '18px',
                            py: '11px',
                            textDecoration: 'none',
                        }}
                    >
                        {t('githubCard.cta')}
                    </Box>
                </Box>
            </Box>
        </Section>
    )
}
