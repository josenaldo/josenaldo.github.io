// Destino: src/features/home/ClosingCta.js — SUBSTITUI o arquivo atual.
// Corrige D-13: estava dentro de <Section>, somando o py de 76px ao gutter do
// Container — duas margens. Aqui o wrapper tem padding 40px e o bloco roxo
// ocupa o resto, com o brilho roxo que faltava.
//
// Este é o único bloco do site com fundo #8855DF em área grande. Título 40px,
// corpo #EDE4FF, botão branco com texto #3B1E77 (não primary.main: sobre
// branco, #8855DF fica em 3.6:1 e reprova AA).

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
        <Section surface="default" padTop={40} padBottom={40} bleed>
            <Box
                sx={{
                    maxWidth: '1280px',
                    mx: 'auto',
                    px: { xs: '24px', md: '40px' },
                }}
            >
                <Box
                    sx={{
                        bgcolor: '#8855DF',
                        borderRadius: '24px',
                        p: { xs: '36px 28px', md: '64px 56px' },
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        gap: { xs: '28px', md: '48px' },
                        boxShadow: '0 30px 70px -40px rgba(136,85,223,1)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            maxWidth: '60ch',
                        }}
                    >
                        <Typography
                            component="h2"
                            sx={{
                                m: 0,
                                fontFamily:
                                    "'Space Grotesk', system-ui, sans-serif",
                                fontSize: { xs: '30px', md: '40px' },
                                fontWeight: 700,
                                letterSpacing: '-.02em',
                                lineHeight: 1.1,
                                color: '#FFFFFF',
                            }}
                        >
                            {t('title')}
                        </Typography>
                        <Typography
                            component="p"
                            sx={{
                                m: 0,
                                fontSize: { xs: '16px', md: '18px' },
                                lineHeight: 1.55,
                                color: '#EDE4FF',
                                textWrap: 'pretty',
                            }}
                        >
                            {t('body')}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        {...buttonProps}
                        sx={{
                            flexShrink: 0,
                            bgcolor: '#FFFFFF',
                            color: '#3B1E77',
                            fontSize: '17px',
                            fontWeight: 600,
                            p: '18px 32px',
                            borderRadius: '12px',
                            boxShadow: 'none',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                                bgcolor: '#F3EDFF',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        {tCta('bookACall')}
                    </Button>
                </Box>
            </Box>
        </Section>
    )
}

export default ClosingCta
