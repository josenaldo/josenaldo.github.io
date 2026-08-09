import Masonry from '@mui/lab/Masonry'
import {
    Badge,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Typography,
} from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import ContentTitle from '@/components/content/ContentTitle'
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

const getYearsOfExperience = (year, currentYear) => currentYear - year

const SkillCard = ({ title, color, skill = [], currentYear }) => {
    return (
        <Card
            sx={{
                border: `1px solid ${color}`,
                borderRadius: 2,
            }}
        >
            <CardContent sx={{ pb: 1 }}>
                <Typography variant="h5" component="h2" sx={{ color }}>
                    {title}
                </Typography>
            </CardContent>

            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 2,
                    pt: 0,
                }}
            >
                {skill.map((s) => (
                    <Badge
                        key={s.name}
                        badgeContent={`${getYearsOfExperience(s.firstContact, currentYear)}+`}
                        sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: color,
                                color: '#000',
                            },
                        }}
                    >
                        <Chip
                            label={s.name}
                            variant="outlined"
                            sx={{ borderColor: color, color }}
                        />
                    </Badge>
                ))}
            </CardContent>
        </Card>
    )
}

export default async function SkillsPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: 'Skills' })

    const skills = contentService
        .getAllSkillsByCategory()
        .map(({ group, color, skills }) => ({
            group,
            color,
            skills: skills.map(({ name, firstContact }) => ({
                name,
                firstContact,
            })),
        }))
    const currentYear = new Date().getFullYear()

    return (
        <Container>
            <Box sx={{ my: 5 }}>
                <ContentTitle title={t('title')} subtitle={t('description')} />
                <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
                    {skills.map(({ group, color, skills: groupSkills }) => (
                        <SkillCard
                            key={group}
                            title={group}
                            color={color}
                            skill={groupSkills}
                            currentYear={currentYear}
                        />
                    ))}
                </Masonry>
            </Box>
        </Container>
    )
}
