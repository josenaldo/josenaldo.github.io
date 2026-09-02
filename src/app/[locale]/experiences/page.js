// Corrige spec/03-paginas-internas.md §5 (tela `4e`). PageHeader +
// ExperienceList (linhas recolhida/expandida, só uma aberta por vez — ver
// ExperienceList.js). O corpo de cada experiência já vem em Markdown com
// headings Challenge/Action/Result (ou Desafio/Ação/Resultado, ou o STAR
// completo Situação/Tarefa/Ação/Resultado em pelo menos um arquivo pt) —
// `parseExperienceSections` separa isso em três blocos sem exigir que o
// conteúdo mude de formato.

import { Box } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import PageHeader from '@/components/PageHeader'
import Section from '@/components/Section'
import { yearsOfExperience } from '@/data/metrics.mjs'
import ExperienceList from '@/features/experiences/ExperienceList'
import { routing } from '@/i18n/routing'
import { parseExperienceSections } from '@/lib/parseExperienceSections'
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
            sections: parseExperienceSections(experience.body.raw),
        }))

    return (
        <Section surface="default" padTop={56} padBottom={48}>
            <PageHeader
                title={t('title')}
                lead={t('description', { years: yearsOfExperience() })}
            />
            <Box sx={{ mt: '16px' }}>
                <ExperienceList experiences={experiences} />
            </Box>
        </Section>
    )
}
