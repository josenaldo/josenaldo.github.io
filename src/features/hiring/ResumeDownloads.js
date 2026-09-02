import { Box, Button, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import { RESUMES } from '@/data/resumes.mjs'

const ResumeDownloads = () => {
    const t = useTranslations('Hiring.resumes')

    const senior = RESUMES.filter((resume) => resume.variant === 'senior')
    const fractional = RESUMES.filter(
        (resume) => resume.variant === 'fractional'
    )

    const labels = {
        'senior-en': t('seniorEn'),
        'senior-pt': t('seniorPt'),
        'fractional-en': t('fractionalEn'),
        'fractional-pt': t('fractionalPt'),
    }

    return (
        <Section surface="default" rhythm="section">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    maxWidth: 'md',
                    mx: 'auto',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h2">{t('title')}</Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    {senior.map((resume) => (
                        <Button
                            key={resume.id}
                            variant="contained"
                            href={resume.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {labels[resume.id]}
                        </Button>
                    ))}
                </Box>

                <Typography variant="body1" color="text.secondary">
                    {t('fractionalNote')}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    {fractional.map((resume) => (
                        <Button
                            key={resume.id}
                            variant="outlined"
                            href={resume.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {labels[resume.id]}
                        </Button>
                    ))}
                </Box>
            </Box>
        </Section>
    )
}

export default ResumeDownloads
