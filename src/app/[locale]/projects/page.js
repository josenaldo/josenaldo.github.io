import { Box, Container } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import ContentCard from '@/components/content/ContentCard'
import ContentTitle from '@/components/content/ContentTitle'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Projects' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `/${locale}/projects`,
            languages: {
                en: '/en/projects',
                pt: '/pt/projects',
            },
        },
    }
}

export default async function ProjectsPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: 'Projects' })

    const projects = contentService.getAllProjects(locale).map((project) => ({
        title: project.title,
        description: project.description,
        url: project.url,
        image: project.image,
        author: project.author,
        date: project.date,
    }))

    return (
        <Container>
            <Box
                sx={{
                    my: 5,
                }}
            >
                <ContentTitle title={t('title')} subtitle={t('description')} />
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: '1fr 1fr 1fr',
                        },
                        alignItems: 'stretch',
                        gap: 3,
                        my: 5,
                    }}
                >
                    {projects.map((project) => (
                        <ContentCard
                            title={project.title}
                            text={project.description}
                            url={project.url}
                            image={project.image}
                            key={project.url}
                            author={project.author}
                            date={project.date}
                            moreLinkText={t('viewProjectCta')}
                        />
                    ))}
                </Box>
            </Box>
        </Container>
    )
}
