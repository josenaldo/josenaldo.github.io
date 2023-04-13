import { Box, Button, Container, Paper, Typography } from '@mui/material'

import Section from '@/components/Section'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import experiences from '@/data/experiences'
import CallToAction from '@/components/CallToAction'

const Experience = () => {
  return (
    <Section elevation={1}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2">My experience</Typography>
        <Box>
          <ExperienceTimeline experiences={experiences} showEllipsis />
        </Box>
        <CallToAction href="/resume">My Resumé</CallToAction>
      </Box>
    </Section>
  )
}

export default Experience
