import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import metrics from '@/data/metrics.mjs'

const {
    codebasesOwned,
    codebasesActive,
    clientReportedIssues,
    deploymentFrequency,
} = metrics

const Evidence = () => {
    const t = useTranslations('Hiring.evidence')

    const markers = [
        t('codebases', {
            owned: codebasesOwned.after.count,
            active: codebasesActive.after.count,
        }),
        t('issues', {
            before: clientReportedIssues.before.count,
            after: clientReportedIssues.after.count,
        }),
        t('deployFrequency', {
            everyDays: deploymentFrequency.after.everyDays,
        }),
    ]

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
                    component="ul"
                    sx={{
                        textAlign: 'left',
                        width: '100%',
                        m: 0,
                        pl: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                    }}
                >
                    {markers.map((marker) => (
                        <Typography key={marker} component="li" variant="body1">
                            {marker}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Section>
    )
}

export default Evidence
