// Corrige D-04. Régua: handoff-site/preview/Home.dc.html, primeiro bloco.
//
// Grid 1fr 400px, gap 56px, padding 76/64. Sete coisas que não existiam:
// kicker âmbar, h1 em 20ch, lead com margem, métricas como card, ação
// secundária, foto retangular r18 e legenda mono sob a foto.
//
// Chaves novas em Home.hero: kicker, secondaryCta, caption. Ver spec/05-i18n.md.
//
// 'use client': a ação secundária passa `Link` como `component` de um
// Typography — referência de função só pode atravessar a fronteira
// server/client se este arquivo já for client (mesmo caso de ClosingCta.js).

'use client'

import { Box, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'

import photo200 from '@/assets/images/josenaldo-200.webp'
import photo300 from '@/assets/images/josenaldo-300.webp'
import photo400 from '@/assets/images/josenaldo-400.webp'
import BookACallButton from '@/components/BookACallButton'
import MetricCard from '@/components/MetricCard'
import Section from '@/components/Section'
import metrics from '@/data/metrics.mjs'
import { Link } from '@/i18n/navigation'
import { metricSideValue } from '@/lib/metricValue'

const { deploymentFrequency, clientReportedIssues, deployDuration } = metrics

const HERO_METRICS = [
    ['deploymentFrequency', deploymentFrequency],
    ['clientReportedIssues', clientReportedIssues],
    ['deployDuration', deployDuration],
]

// clientReportedIssues já tem uma legenda dedicada ("per month", via
// Metrics.clientReportedIssues.unit) — repetir "×/month" dentro do próprio
// valor ficaria redundante com ela. O mock (Home.dc.html) mostra só
// "~100 → ~5", não "~100×/month → ~5×/month".
const plainCount = (side, locale) => {
    if (!side) return null
    const approx = side.confidence === 'counted' ? '~' : ''
    return `${approx}${side.count.toLocaleString(locale)}`
}

const Hero = () => {
    const t = useTranslations('Home.hero')
    const tMetrics = useTranslations('Metrics')
    const locale = useLocale()

    return (
        <Section surface="default" padTop={76} padBottom={64}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' },
                    gap: { xs: '40px', lg: '56px' },
                    alignItems: 'start',
                }}
            >
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
                            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '.16em',
                            textTransform: 'uppercase',
                            color: '#FFAA00',
                        }}
                    >
                        {t('kicker')}
                    </Typography>

                    <Typography variant="h1" sx={{ m: 0, maxWidth: '20ch' }}>
                        {t('headline')}
                    </Typography>

                    <Typography
                        variant="lead"
                        component="p"
                        sx={{ m: 0, maxWidth: '58ch', textWrap: 'pretty' }}
                    >
                        {t('subhead')}
                    </Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(3, 1fr)',
                            },
                            gap: '16px',
                            mt: '8px',
                        }}
                    >
                        {HERO_METRICS.map(([id, metric]) => (
                            <MetricCard
                                key={id}
                                label={tMetrics(`${id}.label`)}
                                before={
                                    id === 'clientReportedIssues'
                                        ? plainCount(metric.before, locale)
                                        : metricSideValue(metric.before, locale)
                                }
                                after={
                                    // deploymentFrequency mostra o intervalo
                                    // (8 days), não a taxa (4×/month) — bate
                                    // com o mock Home.dc.html e com o exemplo
                                    // de spec/01-fundacao.md §8.
                                    metric.after.everyDays !== undefined
                                        ? tMetrics('deploymentFrequency.heroValue', {
                                              days: metric.after.everyDays,
                                          })
                                        : id === 'clientReportedIssues'
                                          ? plainCount(metric.after, locale)
                                          : metricSideValue(metric.after, locale)
                                }
                                unit={
                                    tMetrics.has(`${id}.heroUnit`)
                                        ? tMetrics(`${id}.heroUnit`)
                                        : tMetrics.has(`${id}.unit`)
                                          ? tMetrics(`${id}.unit`)
                                          : undefined
                                }
                                confidence={metric.after.confidence}
                            />
                        ))}
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '24px',
                            mt: '12px',
                        }}
                    >
                        <BookACallButton />
                        <Typography
                            component={Link}
                            href="#engagements"
                            sx={{
                                fontSize: '15px',
                                color: '#B69BF0',
                                textDecoration: 'none',
                                '&:hover': { color: '#CDBBF8' },
                            }}
                        >
                            {t('secondaryCta')}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        maxWidth: '400px',
                        width: '100%',
                    }}
                >
                    <picture>
                        <source
                            type="image/webp"
                            srcSet={`${photo200.src} 200w, ${photo300.src} 300w, ${photo400.src} 400w`}
                            sizes="(max-width: 720px) 280px, 400px"
                        />
                        {/* Retangular, raio 18. Sem círculo e sem anel âmbar. */}
                        <img
                            src={photo400.src}
                            alt={t('photoAlt')}
                            width="400"
                            height="400"
                            loading="eager"
                            fetchPriority="high"
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                borderRadius: '18px',
                            }}
                        />
                    </picture>
                    <Typography
                        component="p"
                        sx={{
                            m: 0,
                            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                            fontSize: '12px',
                            lineHeight: 1.7,
                            color: '#7C8494',
                        }}
                    >
                        {t('caption')}
                    </Typography>
                </Box>
            </Box>
        </Section>
    )
}

export default Hero
