import {
    Badge,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Typography,
} from '@mui/material'
import Masonry from '@mui/lab/Masonry'

import ContentTitle from '@/components/content/ContentTitle'
import AppLAyout from '@/layouts/AppLayout'
import contentService from '@/services/content'

const getStaticProps = async () => {
    const skills = contentService.getAllSkillsByCategory().map(({ group, color, skills }) => ({
        group,
        color,
        skills: skills.map(({ name, firstContact }) => ({ name, firstContact })),
    }))
    const currentYear = new Date().getFullYear()
    return { props: { skills, currentYear } }
}

const getYearsOfExperience = (year, currentYear) => currentYear - year

const ProjectsPage = ({ skills, currentYear }) => {
    const title = 'Skills'
    const description =
        "I'm a software engineer with experience in a variety of technologies. Here are some of the skills I've developed."
    const image = '/images/default.jpg'

    return (
        <AppLAyout
            title={title}
            description={description}
            image={image}
            url="/skills"
        >
            <Container>
                <Box sx={{ my: 5 }}>
                    <ContentTitle title={title} subtitle={description} />
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
        </AppLAyout>
    )
}

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

export { getStaticProps }
export default ProjectsPage
