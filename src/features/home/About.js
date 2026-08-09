import Masonry from '@mui/lab/Masonry'
import { Box, Card, CardContent, Chip, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import CallToAction from '@/components/CallToAction'
import Section from '@/components/Section'

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
                    {/*
                        NOTE(Task 6): estas duas linhas citam "20+ years" e
                        "200k+ users" — números de interface que não existem
                        em src/data/metrics.mjs. Por instrução explícita do
                        brief ("pare e relate"), ficaram de fora da extração
                        para i18n e continuam hardcoded em inglês nos dois
                        locales até essa decisão ser tomada. Ver relatório da
                        Task 6.
                    */}
                    <Typography variant="subtitle">
                        Senior Full Stack Engineer. 20+ years. Java, Spring
                        Boot, React, TypeScript.
                    </Typography>
                    <Typography variant="subtitle">
                        I&apos;ve modernized legacy platforms, led migrations to
                        microservices, and shipped multi-app ecosystems
                        supporting 200k+ users &mdash; always remotely, always
                        with ownership.
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
