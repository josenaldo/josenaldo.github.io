import { Link, Box, Container, Paper, Typography } from '@mui/material'
import Section from '@/components/Section'
import socialLinks from '@/data/socialLinks'

const GetInTouch = () => {
  return (
    <Section elevation={2}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <Typography variant="h2">Get in touch</Typography>
        <Typography variant="body1">
          I'm always open to discussing new projects, creative ideas or
          opportunities to be part of your visions.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            gap: 'clamp(1rem, 5vw, 2rem)',

            color: 'text.secondary',
          }}
        >
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: 'clamp(0.8rem, 5vw, 1.0rem)',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <link.icon
                sx={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                }}
              />
              <span>{link.name}</span>
            </Link>
          ))}
        </Box>
      </Box>
    </Section>
  )
}

export default GetInTouch
