import { Box, Container } from '@mui/material'

import ContentTitle from '@/components/content/ContentTitle'

import SocialList from '@/components/contact/SocialList'
import AppLAyout from '@/layouts/AppLayout'
import { Card, CardContent, Typography, Button, Box as MuiBox } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

const ContactPage = () => {
  const title = 'Get in Touch'
  const description =
    'Connect with Josenaldo by filling out the form. Get in touch for project collaborations, idea-sharing, or just a friendly conversation.'
  const image = '/images/pages/contact.jpg'

  return (
    <AppLAyout
      title={title}
      description={description}
      image={image}
      url="/blog"
    >
      <Container>
        <Box
          sx={{
            my: 5,
          }}
        >
          <ContentTitle title={title} subtitle={description} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3,
              my: 5,
            }}
          >

            <Card
              sx={{
                minWidth: 300,
                maxWidth: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                boxShadow: 3,
                background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                color: '#fff',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <MuiBox sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <GitHubIcon sx={{ fontSize: 48 }} />
                </MuiBox>
                <Typography variant="h5" component="div" gutterBottom>
                  Like this project?
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Explore the source code on GitHub and make it your own! Fork, star, or contribute to help it grow.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  href="https://github.com/josenaldo/josenaldo.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GitHubIcon />}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    px: 3,
                    py: 1,
                    boxShadow: 2,
                  }}
                >
                  Fork on GitHub
                </Button>
              </CardContent>
            </Card>
            <SocialList />

            {/* <ContactForm /> */}
          </Box>
        </Box>
      </Container>
    </AppLAyout>
  )
}

export default ContactPage
