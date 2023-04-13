import { Box, Container, Paper, Typography } from '@mui/material'
import Section from '@/components/Section'

const GetInTouch = () => {
  return (
    <Section elevation={0}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2">Get in touch</Typography>
      </Box>
    </Section>
  )
}

export default GetInTouch
