import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import metrics, { yearsAsSoleHumanAuthor } from '@/data/metrics.mjs'

const { codebasesOwned } = metrics

const HowIOperate = () => {
    const t = useTranslations('Home.howIOperate')

    const markers = [
        t('marker1'),
        t('marker2'),
        t('marker3'),
        t('marker4', {
            years: yearsAsSoleHumanAuthor(),
            repos: codebasesOwned.after.count,
        }),
    ]

    return (
        <Section elevation={1}>
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

                <Typography variant="body1" color="text.secondary">
                    {t('body')}
                </Typography>

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

export default HowIOperate
