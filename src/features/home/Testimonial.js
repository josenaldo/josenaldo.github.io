import {
  Box,
  Avatar,
  Card,
  CardContent,
  Typography
} from '@mui/material'

import Section from '@/components/Section'
import CallToAction from '@/components/CallToAction'

const Testimonial = ({ testimonials }) => {
  const visibleTestimonials = Array.isArray(testimonials) ? testimonials : []

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
        <Typography variant="h2">Testimonials</Typography>

        {visibleTestimonials.length === 0 ? (
          <Box
            sx={{
              width: '100%',
              maxWidth: '720px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              I’m currently collecting testimonials. If we’ve worked together and you’d like to share feedback, I’d love to hear it.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CallToAction href="/contact">Share a testimonial</CallToAction>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 4,
            }}
          >
            {visibleTestimonials.map((testimonial) => (
              <Card key={testimonial.name} sx={{ height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      alt={testimonial.name}
                      src={testimonial.image}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography variant="h6">{testimonial.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.position}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body1" color="secondary" fontStyle="italic">
                    “{testimonial.testimonial}”
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Section>
  )
}

export default Testimonial
