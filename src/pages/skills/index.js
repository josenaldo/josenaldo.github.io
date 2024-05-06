import { Badge, Box, Card, CardContent, Chip, Container, Typography } from '@mui/material'

import ContentTitle from '@/components/content/ContentTitle'

// import { getSortedPosts } from '@pog/data'
import AppLAyout from '@/layouts/AppLayout'
import contentService from '@/services/content'

const getStaticProps = async () => {
  const skills = contentService.getAllSkills()
  return { props: { skills } }
}

const getYearOfExperience = (year) => {
  const currentYear = new Date().getFullYear()
  return currentYear - year

}

const ProjectsPage = ({ skills }) => {
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
        <Box
          sx={{
            my: 5,
          }}
        >
          <ContentTitle title={title} subtitle={description} />
          <SkillCard
            title="Fluent"
            text="I'm entirely comfortable with these skills and can start working immediately without the need for review or reference. I am highly proficient and up-to-date with current practices."
            skill={skills['fluent']} />

          <SkillCard
            title="Proficient"
            text="This category encompasses skills I have worked extensively in the past but may require time to review and update myself on the latest practices and techniques to work effectively with them again. Additionally, it includes technologies I am currently working with, but I still need to acquire the depth of knowledge to consider myself an expert. I am actively learning and improving in these areas to broaden my skill set."
            skill={skills['proficient']} />

          <SkillCard
            title="Familiar"
            text="I'm familiar with and have some degree of experience with these skills, but I would need some time to practice and deepen my proficiency before I could work effectively with them."
            skill={skills['familiar']} />

          <SkillCard
            title="Learner"
            text="These are the technologies I'm actively learning and working to add to my skill set."
            skill={skills['learner']} />
        </Box>
      </Container>
    </AppLAyout >
  )
}

const SkillCard = ({ title, skill = [], text = "" }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="h2" sx={{}}>
          {title}
        </Typography>
        <Typography variant="body1" component="p" sx={{}}>
          {text}
        </Typography>
      </CardContent>

      <CardContent sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 3,
        px: 8,

      }}>

        {skill.map((s) => (
          <Badge key={s.name} badgeContent={`${getYearOfExperience(s.firstContact)}+`} color="primary">
            <Chip label={s.name} variant="outlined" />
          </Badge>

        ))}
      </CardContent>
    </Card>
  )
}

export { getStaticProps }
export default ProjectsPage
