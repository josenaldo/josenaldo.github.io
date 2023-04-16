import { Box, Container, Paper, Typography } from '@mui/material'

const Section = ({ elevation, children, py = 8 }) => {
  return (
    <Box>
      <Paper
        elevation={elevation}
        sx={{
          py: py,
        }}
      >
        <Container>{children}</Container>
      </Paper>
    </Box>
  )
}

export default Section
