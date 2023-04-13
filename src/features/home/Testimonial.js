import { Box, Container, Paper, Typography } from '@mui/material'
import Section from '@/components/Section'

const Testimonial = () => {
  return (
    <Section elevation={2}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2">Testimonial</Typography>
      </Box>
    </Section>
  )
}

export default Testimonial
