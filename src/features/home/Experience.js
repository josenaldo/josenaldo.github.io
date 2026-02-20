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

        }}
      >
        <Typography variant="h2">Experience</Typography>
        <Box>
          <ExperienceTimeline experiences={experiences} showEllipsis />
        </Box>
        <CallToAction href="/experiences" ariaLabel="View all experiences">More</CallToAction>
      </Box>
    </Section>
  )
}

export default Experience
