import { Box, Button, Container, Paper, Typography } from '@mui/material'
import dynamic from 'next/dynamic'

import Section from '@/components/Section'
import CallToAction from '@/components/CallToAction'

const ExperienceTimeline = dynamic(() => import('@/components/ExperienceTimeline'), {
  ssr: false,
  loading: () => <Box sx={{ minHeight: { xs: 320, md: 420 } }} />,
})

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
        <CallToAction href="/experiences" ariaLabel="View all experiences">All roles</CallToAction>
      </Box>
    </Section>
  )
}

export default Experience
