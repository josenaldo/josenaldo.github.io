// Corrige spec/03-paginas-internas.md §13: nao existia not-found.js
// nenhum — os `notFound()` de blog/[slug] e projects/[slug] caiam no 404
// generico e sem estilo do Next. Bloco unico, alinhado a esquerda,
// ritmo 76/76.
//
// 'use client': not-found.js nao recebe `params`, entao a unica forma de
// ler o locale aqui e via hook client-side — o layout de `[locale]` ja
// envolve este arquivo em `NextIntlClientProvider`, entao `useTranslations`
// funciona normalmente.

'use client'

import { Box, Button, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
    const t = useTranslations('NotFound')
    const tNav = useTranslations('Nav')

    return (
        <Section surface="default" padTop={76} padBottom={76}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Typography
                    component="p"
                    sx={{
                        m: 0,
                        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '.16em',
                        textTransform: 'uppercase',
                        color: '#FFAA00',
                    }}
                >
                    404
                </Typography>

                <Typography
                    component="h1"
                    sx={{
                        m: 0,
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        fontSize: '44px',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        color: '#FFFFFF',
                    }}
                >
                    {t('title')}
                </Typography>

                <Typography
                    component="p"
                    sx={{ m: 0, fontSize: '18px', lineHeight: 1.6, color: '#C6CCD8' }}
                >
                    {t('lead')}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '24px',
                        mt: '8px',
                    }}
                >
                    <Button variant="contained" component={Link} href="/">
                        {t('homeCta')}
                    </Button>
                    {[
                        { href: '/blog', label: tNav('blog') },
                        { href: '/projects', label: tNav('projects') },
                        { href: '/contact', label: tNav('contact') },
                    ].map((item) => (
                        <Box
                            key={item.href}
                            component={Link}
                            href={item.href}
                            sx={{
                                fontSize: '15px',
                                color: '#B69BF0',
                                textDecoration: 'none',
                                '&:hover': { color: '#CDBBF8' },
                            }}
                        >
                            {item.label}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Section>
    )
}
