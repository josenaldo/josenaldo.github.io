import { notFound } from 'next/navigation'

import { Container } from '@mui/material'
import { setRequestLocale } from 'next-intl/server'

import ContentView from '@/components/content/ContentView'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
        contentService.getAllProjects(locale).map((project) => ({
            locale,
            slug: project.slug,
        }))
    )
}

export async function generateMetadata({ params }) {
    const { locale, slug } = await params
    const project = contentService.getProjectData(locale, slug)
    if (!project) return {}

    const sibling = contentService.getTranslationSibling(
        project,
        locale === 'en' ? 'pt' : 'en'
    )

    return {
        title: project.title,
        description: project.description,
        alternates: {
            canonical: project.url,
            languages: sibling ? { [sibling.locale]: sibling.url } : undefined,
        },
    }
}

export default async function ProjectPage({ params }) {
    const { locale, slug } = await params
    setRequestLocale(locale)

    const project = contentService.getProjectData(locale, slug)
    if (!project) notFound()

    return (
        <Container>
            <ContentView
                content={project.body.raw}
                title={project.title}
                description={project.description}
                image={project.image}
                date={project.date}
                author={project.author}
                category={project.category}
                url={project.url}
            />
        </Container>
    )
}
