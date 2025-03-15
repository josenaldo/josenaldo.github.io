import {
  Box,
  Typography
} from '@mui/material'

// import Carousel from 'react-material-ui-carousel'


import Section from '@/components/Section'

const Testimonial = ({ testimonials }) => {
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
        <Typography variant="h2">Testimonial</Typography>
        <Box
          sx={{
            width: '100%',
          }}
        >
          {/* <Carousel autoplay={false}>
            {testimonials.map((testimonial, index) => (
              <Box
                sx={{
                  pt: '120px',
                  width: '100%',
                }}
              >
                <Card
                  key={testimonial.name}
                  sx={{
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <CardMedia
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Avatar
                      alt={testimonial.name}
                      src={testimonial.image}
                      sx={{
                        marginTop: '-50%',
                        width: 'clamp(100px, 20vw, 150px)',
                        height: 'clamp(100px, 20vw, 150px)',
                      }}
                    />
                  </CardMedia>
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h5" textTransform="uppercase">
                      {testimonial.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="bold"
                      textTransform="uppercase"
                    >
                      {testimonial.position}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="h4"
                      mt={3}
                      color="secondary"
                      fontStyle="italic"
                    >
                      "{testimonial.testimonial}"
                    </Typography>
                  </CardContent>
                  <CardActions></CardActions>
                </Card>
              </Box>
            ))}
          </Carousel> */}
        </Box>
      </Box>
    </Section>
  )
}

export default Testimonial
