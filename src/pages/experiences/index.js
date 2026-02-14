import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from '@mui/material';

import ContentTitle from '@/components/content/ContentTitle';

import MDXContent from '@/components/content/MDXContent';
import AppLAyout from '@/layouts/AppLayout';
import contentService from '@/services/content';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const getStaticProps = async () => {
  const experiences = contentService.lastExperiences()
  return { props: { experiences } }
}

const ExperiencesPage = ({ experiences }) => {
  const title = 'Professional Experiences'
  const description =
    "20+ years of software engineering across education, media, telecom, and e-commerce. Each experience showcases the challenge faced, actions taken, and measurable results delivered."
  const image = '/images/default.jpg'

  return (
    <AppLAyout
      title={title}
      description={description}
      image={image}
      url="/experiences"
    >
      <Container>
        <Box >
          <ContentTitle title={title} subtitle={description} />

          <Box my={2} >
            {experiences.map((experience) => (
              <Accordion key={experience.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />} >
                  <Box display='flex' flexDirection='column' gap={0}>
                    <Typography variant='h6'>
                      {experience.title}
                    </Typography >
                    <Typography variant='subtitle1'>
                      {experience.company} | {experience.period} | {experience.location}
                    </Typography>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <MDXContent content={experience.body.raw} />
                </AccordionDetails>

              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>
    </AppLAyout >
  )
}

export { getStaticProps };
export default ExperiencesPage
