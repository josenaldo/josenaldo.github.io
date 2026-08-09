import Masonry from '@mui/lab/Masonry'
import { Box, Card, CardContent, Chip, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import CallToAction from '@/components/CallToAction'
import Section from '@/components/Section'
import metrics, { yearsOfExperience } from '@/data/metrics.mjs'

// Formata a contagem bruta de `metrics.mjs` para o formato de apresentação
// ("200000" -> "200k"). O valor numérico vem de lá; o "k" é só apresentação,
// não entra de novo na mensagem de tradução.
const formatThousands = (count) => `${count / 1000}k`

const SkillGroupCard = ({ group, color, skills }) => (
    <Card
        sx={{
            border: `1px solid ${color}`,
            borderRadius: 2,
        }}
    >
        <CardContent sx={{ pb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ color }}>
                {group}
            </Typography>
        </CardContent>
        <CardContent
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 1,
                pt: 0,
            }}
        >
            {skills.map((skill) => (
                <Chip
                    key={skill.name}
                    label={skill.name}
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: color, color }}
                />
            ))}
        </CardContent>
    </Card>
)

const About = ({ skills = [] }) => {
    const t = useTranslations('Home.about')
    const years = yearsOfExperience()
    const trafficPeakUsers = formatThousands(
        metrics.conddizTrafficPeak.after.count
    )

    return (
        <Section elevation={2}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 5,
                }}
            >
                <Typography variant="h2">{t('title')}</Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        textAlign: 'center',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography variant="subtitle">
                        {t('subtitleTech', { years })}
                    </Typography>
                    <Typography variant="subtitle">
                        {t('subtitleModernized', { users: trafficPeakUsers })}
                    </Typography>
                    <Typography variant="subtitle">
                        {t('subtitleFarofa')}
                    </Typography>
                </Box>

                <Masonry
                    columns={{ xs: 1, sm: 2, md: 3 }}
                    spacing={2}
                    sx={{ width: '100%' }}
                >
                    {skills.map(({ group, color, skills: groupSkills }) => (
                        <SkillGroupCard
                            key={group}
                            group={group}
                            color={color}
                            skills={groupSkills}
                        />
                    ))}
                </Masonry>

                <CallToAction href="/about">{t('knowMoreCta')}</CallToAction>
            </Box>
        </Section>
    )
}

export default About
