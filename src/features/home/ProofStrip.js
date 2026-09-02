// Corrige D-05: era faixa de largura total com tudo centralizado; é um
// cartucho inset, rótulo à esquerda, pílulas à direita.
//
// A Section entra em modo `bleed` porque o cartucho tem a própria margem
// lateral (40px) — não é o gutter do canvas.

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Pill from '@/components/Pill'
import Section from '@/components/Section'
import metrics from '@/data/metrics.mjs'

const { codebasesOwned, codebasesActive } = metrics

// Ordem de leitura: o cliente mais recente e mais relevante primeiro.
const CLIENT_KEYS = ['medicalEducationPlatform', 'muvz', 'conddiz']

const ProofStrip = () => {
    const t = useTranslations('Home.proofStrip')

    return (
        <Section surface="default" padTop={0} padBottom={0} bleed>
            <Box
                sx={{
                    maxWidth: '1280px',
                    mx: 'auto',
                    px: { xs: '24px', md: '40px' },
                }}
            >
                <Box
                    sx={{
                        bgcolor: '#101419',
                        borderRadius: '16px',
                        p: { xs: '20px', md: '20px 28px' },
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        gap: { xs: '16px', md: '32px' },
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
                            letterSpacing: '.16em',
                            textTransform: 'uppercase',
                            color: '#7C8494',
                            flex: 'none',
                        }}
                    >
                        {t('label')}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '14px',
                        }}
                    >
                        {CLIENT_KEYS.map((key) => (
                            <Pill key={key} tone="neutral" as="display">
                                {t(`clients.${key}`)}
                            </Pill>
                        ))}
                        <Pill tone="amber">
                            {t('repoCount', {
                                owned: codebasesOwned.after.count,
                                active: codebasesActive.after.count,
                            })}
                        </Pill>
                    </Box>
                </Box>
            </Box>
        </Section>
    )
}

export default ProofStrip
