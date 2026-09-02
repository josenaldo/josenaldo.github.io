'use client'

import { Box, Button, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import { BOOKING_URL } from '@/data/booking'
import { Link } from '@/i18n/navigation'

const ClosingCta = () => {
    const t = useTranslations('Home.closingCta')
    const tCta = useTranslations('Home.cta')

    const buttonProps = BOOKING_URL
        ? {
              component: 'a',
              href: BOOKING_URL,
              target: '_blank',
              rel: 'noopener noreferrer',
          }
        : { component: Link, href: '/contact' }

    return (
        <Section surface="default" rhythm="hero">
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    borderRadius: '24px',
                    p: { xs: 4, md: 7 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 4,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{ color: 'primary.contrastText' }}
                    >
                        {t('title')}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: 'primary.contrastText' }}
                    >
                        {t('body')}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    {...buttonProps}
                    sx={{
                        bgcolor: 'common.white',
                        color: 'primary.main',
                        flexShrink: 0,
                        '&:hover': { bgcolor: 'common.white', opacity: 0.9 },
                    }}
                >
                    {tCta('bookACall')}
                </Button>
            </Box>
        </Section>
    )
}

export default ClosingCta
