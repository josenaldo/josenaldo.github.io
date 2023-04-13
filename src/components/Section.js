import { Box, Container, Paper, Typography } from '@mui/material'

const Section = ({ elevation, children }) => {
  return (
    <Box>
      <Paper
        elevation={elevation}
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="xl">{children}</Container>
      </Paper>
    </Box>
  )
}

export default Section
