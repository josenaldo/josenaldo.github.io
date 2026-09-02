// Corrige spec/03-paginas-internas.md §9 (derivada de `4c` + `4f`). Mesmas
// colunas centradas do post (760/680), mas a pílula de tipo entra no lugar
// da categoria, as pílulas de stack ficam sob o lead, e as ações (View
// project/Source) sobem para a linha de autoria — não há avatar/data/tempo
// de leitura aqui, projetos não têm esses campos.

import { notFound } from 'next/navigation'

import { Box, Typography } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import MDXContent from '@/components/content/MDXContent'
import ProjectCard from '@/components/content/ProjectCard'
import Pill from '@/components/Pill'
import { Link } from '@/i18n/navigation'
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
        openGraph: {
            title: project.title,
            description: project.description,
            url: project.url,
            images: project.image ? [{ url: project.image }] : undefined,
        },
    }
}

export default async function ProjectPage({ params }) {
    const { locale, slug } = await params
    setRequestLocale(locale)

    const project = contentService.getProjectData(locale, slug)
    if (!project) notFound()

    const allProjects = contentService.getAllProjects(locale)
    const index = allProjects.findIndex((p) => p.slug === slug)
    const otherProjects = [allProjects[index - 1], allProjects[index + 1]]
        .filter(Boolean)
        .map((p) => ({
            title: p.title,
            description: p.description,
            url: p.projectUrl,
            type: p.type ?? null,
            stack: p.stack ?? null,
            sourceUrl: p.sourceUrl ?? null,
        }))

    const t = await getTranslations('Projects')
    const tCommon = await getTranslations('Common')

    return (
        <>
            <Box sx={{ maxWidth: '760px', mx: 'auto', px: '24px', pt: '48px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                            fontSize: '12px',
                        }}
                    >
                        {/* `<Link>` como elemento direto, não como `component`
                        de um MUI Typography — mesma nota de blog/[slug]. */}
                        <Link
                            href="/projects"
                            style={{
                                fontFamily: 'inherit',
                                fontSize: 'inherit',
                                color: '#B69BF0',
                                textDecoration: 'none',
                            }}
                        >
                            {t('backToProjects')}
                        </Link>
                        {project.type ? (
                            <>
                                <Typography component="span" sx={{ color: '#7C8494' }}>
                                    /
                                </Typography>
                                <Typography
                                    component="span"
                                    sx={{
                                        color: '#FFAA00',
                                        textTransform: 'uppercase',
                                        letterSpacing: '.08em',
                                    }}
                                >
                                    {project.type}
                                </Typography>
                            </>
                        ) : null}
                    </Box>

                    <Typography
                        component="h1"
                        sx={{
                            m: 0,
                            fontFamily: "'Space Grotesk', system-ui, sans-serif",
                            fontSize: '52px',
                            fontWeight: 700,
                            lineHeight: 1.06,
                            letterSpacing: '-.02em',
                            color: '#FFFFFF',
                        }}
                    >
                        {project.title}
                    </Typography>

                    {project.description ? (
                        <Typography
                            component="p"
                            sx={{ m: 0, fontSize: '20px', lineHeight: 1.55, color: '#C6CCD8' }}
                        >
                            {project.description}
                        </Typography>
                    ) : null}

                    {project.stack && project.stack.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {project.stack.map((item) => (
                                <Pill key={item} tone="neutral" size="sm">
                                    {item}
                                </Pill>
                            ))}
                        </Box>
                    ) : null}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            py: '14px',
                            borderTop: '1px solid rgba(255,255,255,.07)',
                            borderBottom: '1px solid rgba(255,255,255,.07)',
                        }}
                    >
                        {project.projectUrl ? (
                            <Box
                                component="a"
                                href={project.projectUrl}
                                sx={{
                                    fontSize: '14px',
                                    color: '#B69BF0',
                                    textDecoration: 'none',
                                    '&:hover': { color: '#CDBBF8' },
                                }}
                            >
                                {tCommon('viewProject')}
                            </Box>
                        ) : null}
                        {project.sourceUrl ? (
                            <Box
                                component="a"
                                href={project.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    fontSize: '14px',
                                    color: '#7C8494',
                                    textDecoration: 'none',
                                    '&:hover': { color: '#98A0B0' },
                                }}
                            >
                                {tCommon('source')}
                            </Box>
                        ) : null}
                    </Box>
                </Box>
            </Box>

            {project.image ? (
                <Box sx={{ maxWidth: '900px', mx: 'auto', px: '24px', mt: '32px' }}>
                    <Box
                        component="img"
                        src={project.image}
                        alt={project.title}
                        sx={{ width: '100%', borderRadius: '18px', display: 'block' }}
                    />
                </Box>
            ) : null}

            <Box
                sx={{
                    maxWidth: '680px',
                    mx: 'auto',
                    px: '24px',
                    mt: '40px',
                    fontSize: '19px',
                    lineHeight: 1.75,
                    color: '#D5DAE4',
                    '& > *': { mb: '24px' },
                    '& h2': {
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        mt: '16px',
                    },
                }}
            >
                <MDXContent content={project.body.raw} />
            </Box>

            {otherProjects.length > 0 ? (
                <Box sx={{ bgcolor: '#0E1218', mt: '48px', py: '40px' }}>
                    <Box
                        sx={{
                            maxWidth: '900px',
                            mx: 'auto',
                            px: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                    >
                        <Typography
                            component="p"
                            sx={{
                                m: 0,
                                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                                fontSize: '11px',
                                fontWeight: 600,
                                letterSpacing: '.14em',
                                textTransform: 'uppercase',
                                color: '#98A0B0',
                            }}
                        >
                            {t('keepExploring')}
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: '16px',
                            }}
                        >
                            {otherProjects.map((p) => (
                                <ProjectCard key={p.url} {...p} />
                            ))}
                        </Box>
                    </Box>
                </Box>
            ) : null}
        </>
    )
}
