import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Container,
    Typography,
} from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import ContentTitle from '@/components/content/ContentTitle'
import MDXContent from '@/components/content/MDXContent'
import { yearsOfExperience } from '@/data/metrics.mjs'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Experiences' })

    return {
        title: t('title'),
        description: t('description', { years: yearsOfExperience() }),
        alternates: {
            canonical: `/${locale}/experiences`,
            languages: {
                en: '/en/experiences',
                pt: '/pt/experiences',
            },
        },
    }
}

export default async function ExperiencesPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: 'Experiences' })

    const experiences = contentService
        .lastExperiences(locale)
        .map((experience) => ({
            id: experience.id,
            title: experience.title,
            company: experience.company,
            period: experience.period,
            location: experience.location,
            body: { raw: experience.body.raw },
        }))

    return (
        <Container>
            <Box>
                <ContentTitle
                    title={t('title')}
                    subtitle={t('description', { years: yearsOfExperience() })}
                />

                <Box my={2}>
                    {experiences.map((experience) => (
                        <Accordion key={experience.id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap={0}
                                >
                                    <Typography variant="h6">
                                        {experience.title}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {experience.company} |{' '}
                                        {experience.period} |{' '}
                                        {experience.location}
                                    </Typography>
                                </Box>
                            </AccordionSummary>

                            <AccordionDetails>
                                <MDXContent content={experience.body.raw} />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Box>
        </Container>
    )
}
