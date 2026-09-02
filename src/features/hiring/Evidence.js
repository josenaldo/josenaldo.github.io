import { Box, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'

import MetricDelta from '@/components/MetricDelta'
import Section from '@/components/Section'
import metrics from '@/data/metrics.mjs'
import { metricSideValue } from '@/lib/metricValue'

const {
    codebasesOwned,
    codebasesActive,
    clientReportedIssues,
    deploymentFrequency,
} = metrics

const Evidence = () => {
    const t = useTranslations('Hiring.evidence')
    const tMetrics = useTranslations('Metrics')
    const locale = useLocale()

    return (
        <Section surface="band" rhythm="section">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    maxWidth: 'md',
                    mx: 'auto',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h2">{t('title')}</Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(2, 1fr)',
                            sm: 'repeat(4, 1fr)',
                        },
                        gap: 4,
                        width: '100%',
                        textAlign: 'left',
                    }}
                >
                    <MetricDelta
                        label={tMetrics('codebasesOwned.label')}
                        before={metricSideValue(codebasesOwned.before, locale)}
                        after={metricSideValue(codebasesOwned.after, locale)}
                        confidence={codebasesOwned.after.confidence}
                    />
                    <MetricDelta
                        label={tMetrics('codebasesActive.label')}
                        before={metricSideValue(
                            codebasesActive.before,
                            locale
                        )}
                        after={metricSideValue(codebasesActive.after, locale)}
                        confidence={codebasesActive.after.confidence}
                    />
                    <MetricDelta
                        label={tMetrics('clientReportedIssues.label')}
                        before={metricSideValue(
                            clientReportedIssues.before,
                            locale
                        )}
                        after={metricSideValue(
                            clientReportedIssues.after,
                            locale
                        )}
                        unit={tMetrics('clientReportedIssues.unit')}
                        confidence={clientReportedIssues.after.confidence}
                    />
                    <MetricDelta
                        label={tMetrics('deploymentFrequency.label')}
                        before={metricSideValue(
                            deploymentFrequency.before,
                            locale
                        )}
                        after={metricSideValue(
                            deploymentFrequency.after,
                            locale
                        )}
                        confidence={deploymentFrequency.after.confidence}
                    />
                </Box>
            </Box>
        </Section>
    )
}

export default Evidence
