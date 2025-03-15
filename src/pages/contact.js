import { Box, Container } from '@mui/material'

import ContentTitle from '@/components/content/ContentTitle'

import SocialList from '@/components/contact/SocialList'
import AppLAyout from '@/layouts/AppLayout'

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
              gap: 3,
              my: 5,
            }}
          >
            <SocialList />

            {/* <ContactForm /> */}
          </Box>
        </Box>
      </Container>
    </AppLAyout>
  )
}

export default ContactPage
