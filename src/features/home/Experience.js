import { Box, Container, Paper, Typography } from '@mui/material'
import Section from '@/components/Section'

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
      </Box>
    </Section>
  )
}

export default Experience
