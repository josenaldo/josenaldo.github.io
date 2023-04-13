import { Box, Chip, Button, Typography } from '@mui/material'
import Section from '@/components/Section'
import skills from '@/data/skills'

const colors = ['secondary.light', 'secondary.main', 'secondary.dark']

const About = () => {
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
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-evenly',
            justifyItems: 'center',
            alignItems: 'stretch',
            gap: 5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: { xs: '100%', md: '50%' },
            }}
          >
            <Typography variant="h5">Howdy!</Typography>
            <Typography variant="subtitle">
              Hello! I'm Josenaldo, a technology enthusiast with over 20 years
              of experience. I love working with Java, JavaScript, React, and
              NextJS. I always strive to stay up-to-date. In my free time, I
              enjoy sharing my knowledge through my blog. Let's have a chat
              about technology and explore new opportunities together!
            </Typography>
            <Box mt={4} gap={2} display="flex">
              <Button variant="contained" href="/resume">
                View my resume
              </Button>
              <Button variant="contained" color="secondary" href="/resume">
                Download my resume
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'stretch',
              alignContent: 'space-between',
              gap: 2,
              width: { xs: '100%', md: '50%' },
            }}
          >
            {skills.map((skill, index) => (
              <Chip
                key={skill}
                label={skill}
                variant="outlined"
                color="secondary"
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Section>
  )
}

export default About
