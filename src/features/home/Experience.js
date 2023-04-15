import { Box, Button, Container, Paper, Typography } from '@mui/material'

import Section from '@/components/Section'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import CallToAction from '@/components/CallToAction'

const Experience = ({ experiences }) => {
  return (
    <Section elevation={1}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          gap: 5,
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
