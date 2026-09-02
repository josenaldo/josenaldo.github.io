'use client'

import { Box, Container, Link as MuiLink, Stack, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import { SITE_LAUNCH_YEAR } from '@/data/metrics.mjs'
import pages, { aboutSubNav } from '@/data/pages'
import socialLinks from '@/data/socialLinks'
import { Link } from '@/i18n/navigation'

const Footer = () => {
    const t = useTranslations('Nav')
    const tFooter = useTranslations('Footer')
    const currentYear = new Date().getFullYear()

    const siteLinks = [...pages, ...aboutSubNav]

    return (
        <Box
            component="footer"
            sx={(theme) => ({
                bgcolor: theme.surface.band,
                py: '32px',
                px: '44px',
            })}
        >
            <Container maxWidth="xl">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 4, md: 8 }}
                    justifyContent="space-between"
                >
                    <Box>
                        <Typography variant="overline" component="p">
                            {tFooter('siteColumnTitle')}
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                            {siteLinks.map((page) => (
                                <MuiLink
                                    key={page.name}
                                    component={Link}
                                    href={page.url}
                                >
                                    {t(page.name)}
                                </MuiLink>
                            ))}
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="overline" component="p">
                            {tFooter('elsewhereColumnTitle')}
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                            {socialLinks.map((social) => (
                                <MuiLink
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {social.name}
                                </MuiLink>
                            ))}
                        </Stack>
                    </Box>
                </Stack>

                <Typography
                    variant="caption"
                    component="p"
                    sx={{ mt: 4, textAlign: { xs: 'center', md: 'left' } }}
                >
                    {tFooter('copyright', {
                        startYear: SITE_LAUNCH_YEAR,
                        currentYear,
                    })}
                </Typography>
            </Container>
        </Box>
    )
}

export default Footer
