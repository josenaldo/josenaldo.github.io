import { Box, Container, Paper, Typography } from '@mui/material'
import Section from '@/components/Section'

const Services = () => {
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
        <Typography variant="h2">Services</Typography>
      </Box>
    </Section>
  )
}

export default Services
