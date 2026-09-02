// Destino: src/features/home/HowIOperate.js — SUBSTITUI o arquivo atual.
// Corrige D-09: era lista centralizada; passa a ser spine `03` + parágrafo +
// grid 2x2 de marcadores com tag roxa.
//
// Os quatro marcadores deixam de ser strings soltas (marker1..marker4) e
// ganham um rótulo cada: Home.howIOperate.markers.{timezone,cadence,
// decisions,ownership}.{tag,text}. Ver spec/05-i18n.md §2 — a copy dos textos
// é a mesma de hoje, só migra de chave.

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import SectionHeader from '@/components/SectionHeader'
import metrics, { yearsAsSoleHumanAuthor } from '@/data/metrics.mjs'

const { codebasesOwned } = metrics

const MARKER_KEYS = ['timezone', 'cadence', 'decisions', 'ownership']

const HowIOperate = () => {
    const t = useTranslations('Home.howIOperate')

    return (
        <Section surface="band" padTop={76} padBottom={76}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '360px 1fr' },
                    gap: { xs: '32px', lg: '56px' },
                    alignItems: 'start',
                }}
            >
                <SectionHeader n="03" title={t('title')} variant="spine" />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        minWidth: 0,
                    }}
                >
                    <Typography
                        component="p"
                        sx={{
                            m: 0,
                            fontSize: '17px',
                            lineHeight: 1.7,
                            color: '#C6CCD8',
                            maxWidth: '70ch',
                            textWrap: 'pretty',
                        }}
                    >
                        {t('body')}
                    </Typography>

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
                        {MARKER_KEYS.map((key) => (
                            <Box
                                key={key}
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
                                    {t(`markers.${key}.tag`)}
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
                                    {t(`markers.${key}.text`, {
                                        years: yearsAsSoleHumanAuthor(),
                                        repos: codebasesOwned.after.count,
                                    })}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Section>
    )
}

export default HowIOperate
