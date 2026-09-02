'use client'

import { Box, Link as MuiLink, Stack, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import { SITE_LAUNCH_YEAR } from '@/data/metrics.mjs'
import pages, { aboutSubNav } from '@/data/pages'
import socialLinks from '@/data/socialLinks'
import { Link } from '@/i18n/navigation'

const COLUMN_TITLE_SX = {
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    color: '#4E5666',
}

const LINK_SX = {
    fontSize: '14px',
    color: '#98A0B0',
}

const Footer = () => {
    const t = useTranslations('Nav')
    const tFooter = useTranslations('Footer')
    const currentYear = new Date().getFullYear()

    const siteLinks = [...pages, ...aboutSubNav]

    return (
        <Box
            component="footer"
            sx={(theme) => ({
                // O mock não faz do rodapé uma faixa: ele fica no mesmo fundo
                // da página. Com `band` o rodapé virava um bloco mais claro
                // logo abaixo do CTA, competindo com ele.
                bgcolor: theme.surface.default,
                padding: { xs: '24px', md: '24px 40px 44px' },
            })}
        >
            <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={{ xs: 4, md: 0 }}
                >
                    {/* gap no container, não `mt` no filho: o tema zera a
                    margem de todo `p` gerado por Typography, então o `mt: 6px`
                    que existia aqui nunca chegou a valer e as duas linhas
                    ficavam coladas. */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily:
                                    "'Space Grotesk', system-ui, sans-serif",
                                fontSize: '15px',
                                fontWeight: 700,
                                color: '#E9ECF2',
                            }}
                        >
                            Josenaldo Matos
                        </Typography>
                        <Typography
                            component="p"
                            sx={{
                                fontFamily:
                                    "'IBM Plex Mono', ui-monospace, monospace",
                                fontSize: '12px',
                                color: '#7C8494',
                            }}
                        >
                            {tFooter('copyright', {
                                startYear: SITE_LAUNCH_YEAR,
                                currentYear,
                            })}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing="56px">
                        <Box>
                            <Typography component="p" sx={COLUMN_TITLE_SX}>
                                {tFooter('siteColumnTitle')}
                            </Typography>
                            <Stack spacing="8px" sx={{ mt: '12px' }}>
                                {siteLinks.map((page) => (
                                    <MuiLink
                                        key={page.name}
                                        component={Link}
                                        href={page.url}
                                        sx={LINK_SX}
                                    >
                                        {t(page.name)}
                                    </MuiLink>
                                ))}
                            </Stack>
                        </Box>

                        <Box>
                            <Typography component="p" sx={COLUMN_TITLE_SX}>
                                {tFooter('elsewhereColumnTitle')}
                            </Typography>
                            <Stack spacing="8px" sx={{ mt: '12px' }}>
                                {socialLinks.map((social) => (
                                    <MuiLink
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        sx={LINK_SX}
                                    >
                                        {social.name}
                                    </MuiLink>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    )
}

export default Footer
