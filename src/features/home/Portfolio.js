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
  const titleLineClamp = 2
  const descriptionLineClamp = 3

  const lineClampSx = (lines) => ({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lines,
    overflow: 'hidden',
  })

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
            alignItems: 'stretch',
            gap: 4,
            width: '100%',
          }}
        >
          {projects.map((project) => (
            <Card
              key={project.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                transition: (theme) =>
                  theme.transitions.create(['transform', 'box-shadow'], {
                    duration: theme.transitions.duration.short,
                  }),
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                sx={{
                  aspectRatio: '16/9',
                  width: '100%',
                  position: 'relative',
                  lineHeight: 0,
                }}
              >
                <Image
                  src={project.imageThumb || project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    ...lineClampSx(titleLineClamp),
                    minHeight: '2.8em',
                  }}
                >
                  {project.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    ...lineClampSx(descriptionLineClamp),
                    minHeight: '4.3em',
                  }}
                >
                  {project.description}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 2,
                  pb: 2,
                  pt: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Button href={project.url} aria-label={`Open ${project.title}`}>View project</Button>
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
        <CallToAction href="/projects" ariaLabel="View all projects">All projects</CallToAction>
      </Box>
    </Section>
  )
}

export default Portfolio
