import Masonry from '@mui/lab/Masonry'
import { Box, Card, CardContent, Chip, Typography } from '@mui/material'

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
                <Typography variant="h2">About Me</Typography>

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
                        I write, mentor, and make a very good farofa.
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

                <CallToAction href="/about">Know more</CallToAction>
            </Box>
        </Section>
    )
}

export default About
