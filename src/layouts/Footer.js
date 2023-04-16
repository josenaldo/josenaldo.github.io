import { Box, Container, Paper, Typography, Link } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import socialLinks from '@/data/socialLinks'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        width: '100%',
      }}
    >
      <Paper
        elevation={1}
        sx={{
          width: '100%',
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'text.secondary',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mt: 3,
                fontSize: '0.7rem',
                textAlign: 'center',
              }}
            >
              © 2023 Josenaldo de Oliveira Matos Filho - Todos os direitos
              reservados.
            </Box>
          </Box>
        </Container>
      </Paper>
    </Box>
  )
}

export default Footer
