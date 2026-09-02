import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import photo200 from '@/assets/images/josenaldo-200.webp'
import photo300 from '@/assets/images/josenaldo-300.webp'
import photo400 from '@/assets/images/josenaldo-400.webp'
import BookACallButton from '@/components/BookACallButton'
import Section from '@/components/Section'
import metrics from '@/data/metrics.mjs'

const { deploymentFrequency, clientReportedIssues, deployDuration } = metrics

const Hero = () => {
    const t = useTranslations('Home.hero')

    return (
        <Section surface="band" rhythm="hero">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 5,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: { xs: 'center', sm: 'center', md: 'left' },
                        maxWidth: { sm: '100%', md: 'clamp(300px,50vw,50%)' },
                    }}
                >
                    <Typography variant="h1">{t('headline')}</Typography>
                    <Typography variant="subtitle">{t('subhead')}</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                            {t('metricDeploys', {
                                everyDays: deploymentFrequency.after.everyDays,
                            })}
                        </Typography>
                        <Typography variant="body1">
                            {t('metricIssues', {
                                before: clientReportedIssues.before.count,
                                after: clientReportedIssues.after.count,
                            })}
                        </Typography>
                        <Typography variant="body1">
                            {t('metricDeployTime', {
                                before: deployDuration.before.display,
                                after: deployDuration.after.display,
                            })}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            mt: 3,
                        }}
                    >
                        <BookACallButton />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        aspectRatio: '1/1',
                        width: 'clamp(200px,50vw,400px)',
                        my: { xs: 4, sm: 4, md: 0 },
                    }}
                >
                    <picture>
                        <source
                            type="image/webp"
                            srcSet={`${photo200.src} 200w, ${photo300.src} 300w, ${photo400.src} 400w`}
                            sizes="(max-width: 600px) 200px, (max-width: 960px) 300px, 400px"
                        />
                        <img
                            src={photo400.src}
                            alt={t('photoAlt')}
                            width="400"
                            height="400"
                            loading="eager"
                            fetchPriority="high"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </picture>
                </Box>
            </Box>
        </Section>
    )
}

export default Hero
