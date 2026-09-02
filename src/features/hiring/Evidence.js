// Corrige Bloco 2 de spec/03-paginas-internas.md §1: era MetricDelta
// (antes→depois) num grid centralizado; vira StatCard (valor único) num
// grid de 4, alinhado à esquerda, com `SectionHeader n="01"`.
//
// Os quatro números são literais da spec (10 repositórios, ~5 chamados/mês,
// 8 dias entre releases, 9.120 testes) — batem com
// codebasesOwned/clientReportedIssues/deploymentFrequency.everyDays/
// automatedTests em data/metrics.mjs.

import { Box, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'

import Section from '@/components/Section'
import SectionHeader from '@/components/SectionHeader'
import StatCard from '@/components/StatCard'
import metrics from '@/data/metrics.mjs'
import { metricSideValue } from '@/lib/metricValue'

const { codebasesOwned, clientReportedIssues, deploymentFrequency, automatedTests } =
    metrics

const Evidence = () => {
    const t = useTranslations('Hiring.evidence')
    const tMetrics = useTranslations('Metrics')
    const locale = useLocale()

    const stats = [
        {
            id: 'codebasesOwned',
            value: metricSideValue(codebasesOwned.after, locale),
            caption: tMetrics('codebasesOwned.label'),
            confidence: codebasesOwned.after.confidence,
        },
        {
            id: 'clientReportedIssues',
            value: metricSideValue(clientReportedIssues.after, locale),
            caption: tMetrics('clientReportedIssues.resultCaption'),
            confidence: clientReportedIssues.after.confidence,
        },
        {
            id: 'deploymentFrequency',
            value: t('cadenceValue', {
                days: deploymentFrequency.after.everyDays,
            }),
            caption: tMetrics('deploymentFrequency.label'),
            confidence: deploymentFrequency.after.confidence,
        },
        {
            id: 'automatedTests',
            value: metricSideValue(automatedTests.after, locale),
            caption: tMetrics('automatedTests.label'),
            confidence: automatedTests.after.confidence,
        },
    ]

    return (
        <Section surface="band" padTop={56} padBottom={56}>
            <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
            >
                <SectionHeader n="01" title={t('title')} />

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                        gap: '16px',
                    }}
                >
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.id}
                            value={stat.value}
                            caption={stat.caption}
                            confidence={stat.confidence}
                        />
                    ))}
                </Box>

                <Typography
                    component="p"
                    sx={{
                        m: 0,
                        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                        fontSize: '12px',
                        color: '#7C8494',
                    }}
                >
                    {t('confidenceNote')}
                </Typography>
            </Box>
        </Section>
    )
}

export default Evidence
