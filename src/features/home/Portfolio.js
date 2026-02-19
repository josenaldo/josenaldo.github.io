import {
  Box,
  Button,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import Section from '@/components/Section'
import Image from 'next/image'
import CallToAction from '@/components/CallToAction'

const Portfolio = ({ projects }) => {
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
        <Typography variant="h2">Portfolio</Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 4,
          }}
        >
          {projects.map((project, index) => (
            <Card
              key={project.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardMedia
                sx={{
                  aspectRatio: '16/9',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button href={project.url}>More</Button>
                <Button
                  color="secondary"
                  href={project.projectUrl}
                  target="_blank"
                >
                  Visit
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
        <CallToAction href="/projects">Read More</CallToAction>
      </Box>
    </Section>
  )
}

export default Portfolio
