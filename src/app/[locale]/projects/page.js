// Corrige spec/03-paginas-internas.md §6 (tela `4f`). Grid 1fr 1fr de
// ProjectCard — sem imagem de capa, "a stack é a informação".

import { Box } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import ProjectCard from '@/components/content/ProjectCard'
import PageHeader from '@/components/PageHeader'
import Section from '@/components/Section'
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
        url: project.projectUrl,
        type: project.type ?? null,
        stack: project.stack ?? null,
        sourceUrl: project.sourceUrl ?? null,
    }))

    return (
        <Section surface="default" padTop={56} padBottom={48}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <PageHeader title={t('title')} lead={t('description')} />

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: '16px',
                    }}
                >
                    {projects.map((project) => (
                        <ProjectCard key={project.url} {...project} />
                    ))}
                </Box>
            </Box>
        </Section>
    )
}
