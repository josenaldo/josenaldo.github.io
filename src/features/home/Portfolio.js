import { Box, Container, Paper, Typography } from '@mui/material'
import Section from '@/components/Section'

const Portfolio = () => {
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
        <Typography variant="h2">Portfolio</Typography>
      </Box>
    </Section>
  )
}

export default Portfolio
