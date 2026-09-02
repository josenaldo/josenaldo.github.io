import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'

const IsThisYou = () => {
    const t = useTranslations('Home.isThisYou')
    const symptoms = t.raw('symptoms')

    return (
        <Section surface="default" rhythm="hero">
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
                    {symptoms.map((symptom) => (
                        <Typography
                            key={symptom}
                            component="li"
                            variant="body1"
                        >
                            {symptom}
                        </Typography>
                    ))}
                </Box>

                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {t('closing')}
                </Typography>
            </Box>
        </Section>
    )
}

export default IsThisYou
