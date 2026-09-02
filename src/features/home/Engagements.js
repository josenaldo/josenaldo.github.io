'use client'

import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import MetricDelta from '@/components/MetricDelta'
import Section from '@/components/Section'
import metrics from '@/data/metrics.mjs'
import { metricSideValue } from '@/lib/metricValue'

// Curadoria de quais métricas de metrics.mjs aparecem no bloco Result de cada
// engagement — decisão de conteúdo, não algoritmo. Cada engagement tem um
// número diferente de métricas disponíveis (2 a 9); esta tabela escolhe as
// 2-4 mais relevantes por engagement, já validadas com o dono do site.
// `digidados` tem métricas em metrics.mjs mas não tem card na home (não
// existe content/engagements/*/digidados.md) — não entra aqui.
const RESULT_METRICS_BY_ENGAGEMENT = {
    medespecialista: [
        'deploymentFrequency',
        'clientReportedIssues',
        'deployDuration',
        'followUpOperation',
    ],
    muvz: ['muvzDelay', 'muvzPerformance', 'muvzSprintCadence'],
    conddiz: ['conddizArchitecture', 'conddizTrafficPeak'],
}

const Engagements = ({ engagements }) => {
    const t = useTranslations('Home.engagements')
    const tMetrics = useTranslations('Metrics')
    const locale = useLocale()
    const visibleEngagements = Array.isArray(engagements) ? engagements : []

    return (
        <Section surface="default" rhythm="hero">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 5,
                }}
            >
                <Typography variant="h2">{t('title')}</Typography>

                {visibleEngagements.length === 0 ? (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        textAlign="center"
                    >
                        {t('emptyState')}
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        {visibleEngagements.map((engagement) => {
                            const metricIds =
                                RESULT_METRICS_BY_ENGAGEMENT[
                                    engagement.translationKey
                                ] ?? []

                            return (
                                <Card
                                    key={engagement.title}
                                    elevation={2}
                                    sx={{
                                        bgcolor: 'background.paper',
                                        borderRadius: '16px',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            p: 4,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="h5"
                                                component="h3"
                                            >
                                                {engagement.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {engagement.role} ·{' '}
                                                {engagement.period}
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <Typography
                                                variant="overline"
                                                color="text.secondary"
                                            >
                                                {t('arrived')}
                                            </Typography>
                                            <Typography variant="body1">
                                                {engagement.arrived}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography
                                                variant="overline"
                                                color="text.secondary"
                                            >
                                                {t('built')}
                                            </Typography>
                                            <Typography variant="body1">
                                                {engagement.built}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={(theme) => ({
                                                bgcolor: theme.surface.result,
                                                color: theme.ink.body,
                                                borderRadius: 2,
                                                p: 3,
                                                mt: 1,
                                            })}
                                        >
                                            <Typography
                                                variant="overline"
                                                sx={{
                                                    color: 'inherit',
                                                }}
                                            >
                                                {t('result')}
                                            </Typography>

                                            {metricIds.length > 0 && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 3,
                                                        my: 2,
                                                    }}
                                                >
                                                    {metricIds.map((id) => {
                                                        const metric =
                                                            metrics[id]

                                                        return (
                                                            <MetricDelta
                                                                key={id}
                                                                label={tMetrics(
                                                                    `${id}.label`
                                                                )}
                                                                before={metricSideValue(
                                                                    metric.before,
                                                                    locale
                                                                )}
                                                                after={metricSideValue(
                                                                    metric.after,
                                                                    locale
                                                                )}
                                                                unit={tMetrics.has(
                                                                    `${id}.unit`
                                                                )
                                                                    ? tMetrics(
                                                                          `${id}.unit`
                                                                      )
                                                                    : undefined}
                                                                confidence={
                                                                    metric.after
                                                                        .confidence
                                                                }
                                                            />
                                                        )
                                                    })}
                                                </Box>
                                            )}

                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'inherit',
                                                }}
                                            >
                                                {engagement.result}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Box>
                )}
            </Box>
        </Section>
    )
}

Engagements.propTypes = {
    engagements: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            role: PropTypes.string,
            period: PropTypes.string,
            arrived: PropTypes.string,
            built: PropTypes.string,
            result: PropTypes.string,
            translationKey: PropTypes.string,
        })
    ),
}

export default Engagements
