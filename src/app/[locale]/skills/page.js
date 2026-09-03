// Corrige spec/03-paginas-internas.md §11: era Masonry de cards por grupo com
// borda colorida e Badge de "anos de experiência" por skill. A spec pede o
// oposto — "nível de proficiência não vira barra nem estrela: se importa,
// vira ordem" — então a borda colorida e o badge de anos saem; a ordem por
// `firstContact` que `getAllSkillsByCategory` já produzia continua sendo o
// único sinal de força dentro do grupo.

import { Box } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import PageHeader from '@/components/PageHeader'
import Pill from '@/components/Pill'
import Section from '@/components/Section'
import SectionHeader from '@/components/SectionHeader'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Skills' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `/${locale}/skills`,
            languages: {
                en: '/en/skills',
                pt: '/pt/skills',
            },
        },
    }
}

export default async function SkillsPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: 'Skills' })

    const groups = contentService
        .getAllSkillsByCategory()
        .map(({ group, skills }) => ({
            group,
            skills: skills.map(({ name }) => name),
        }))

    return (
        <Section surface="default" padTop={56} padBottom={48}>
            <PageHeader title={t('title')} lead={t('description')} />

            <Box
                sx={{
                    mt: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                {/* Cada grupo é uma SEÇÃO, não um card: o título usava 21px,
                o mesmo degrau do título de um card de projeto, e lia como se
                fosse um. `SectionHeader size="md"` é o degrau de seção das
                páginas internas (32px), com o numeral que o resto do site já
                usa para marcar ordem. */}
                {groups.map(({ group, skills }, index) => (
                    <Box
                        key={group}
                        sx={{
                            bgcolor: '#14181F',
                            borderRadius: '18px',
                            p: '26px 28px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                    >
                        <SectionHeader
                            n={String(index + 1).padStart(2, '0')}
                            title={group}
                            size="md"
                        />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {skills.map((name) => (
                                <Pill key={name} tone="neutral">
                                    {name}
                                </Pill>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Section>
    )
}
