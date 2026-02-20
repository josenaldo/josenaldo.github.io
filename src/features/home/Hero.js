import { Box, Button, Container, Paper, Typography } from '@mui/material'

import Image from 'next/image'
import Section from '@/components/Section'
import CallToAction from '@/components/CallToAction'
import photo from '@/assets/images/josenaldo.png'

const Hero = () => {
  return (
    <Section elevation={1}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-evenly',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: { xs: 'center', sm: 'center', md: 'left' },
            maxWidth: { sm: '100%', md: 'clamp(300px,50vw,50%)' },
          }}
        >
          <Typography variant="h5" component="p">Hello, my name is </Typography>
          <Typography variant="h1">Josenaldo Matos</Typography>
          <Typography variant="subtitle">
            With 20+ years in tech, I specialize in Java & JS (React, NextJS)
            web development. Explore my portfolio, read my blog, and come talk
            about your project!
          </Typography>
          <CallToAction href="/contact">Get in Touch</CallToAction>
        </Box>
        <Box
          sx={{
            display: 'flex',
            aspectRatio: '1/1',
            position: 'relative',
            width: 'clamp(200px,50vw,400px)',
            my: { xs: 4, sm: 4, md: 0 },
          }}
        >
          <Image src={photo} alt="Josenaldo Matos" fill priority />
        </Box>
      </Box>
    </Section>
  )
}

export default Hero
