import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Container, Typography } from '@mui/material'

import ContentTitle from '@/components/content/ContentTitle'
import MDXContent from '@/components/content/MDXContent'

import Link from '@/components/ui/Link'
import { allCourses } from '@/features/courses/api/courses'
import AppLAyout from '@/layouts/AppLayout'
import { formatDate } from '@/shared/utils/date-format-utils'
import { useState } from 'react'

function CourseItem({ course, expanded, onChange }) {

  const id = `${course.slug}-id`
  const contentId = `${course.slug}-content`
  const headerId = `${course.slug}-header`

  return (
    <Accordion id={id} expanded={expanded === id} onChange={onChange(id)}>
      <AccordionSummary aria-controls={contentId} id={headerId} expandIcon={<ExpandMoreIcon />} >
        <Box display='flex' flexDirection='column' gap={0}>
          <Typography variant='h6'>
            {course.name}
          </Typography >
          <Typography variant='caption'>
            {formatDate(course.completionDate)} | {course.institution} | {course.workload} hours
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails>

        <Box display='flex' flexDirection='row' gap={2}>
          <Link href={course.courseLink} target='_blank' rel='noopener noreferrer'>
            <Chip label='Course Link' color='primary' clickable />
          </Link>
          <Link href={course.certificateLink} target='_blank' rel='noopener noreferrer'>
            <Chip label='Certificate' color='primary' clickable />
          </Link>
        </Box>
        <MDXContent content={course.body.raw} />
      </AccordionDetails>

    </Accordion >
  )
}

const getStaticProps = async () => {
  const courses = allCourses()
  return { props: { courses: courses } }
}

const ExperiencesPage = ({ courses }) => {
  const [expanded, setExpanded] = useState(false)

  const onChange = (panel) => (event, newExpanded) => {

    console.log('new expanded', newExpanded)
    setExpanded(newExpanded ? panel : false)
  }

  const title = 'Courses'
  const description =
    'A detailed list of my courses, including the institution, completion date, workload, course link, and certificate link.'
  const image = '/images/default.jpg'


  return (
    <AppLAyout
      title={title}
      description={description}
      image={image}
      url="/courses"
    >
      <Container>
        <Box >
          <ContentTitle title={title} subtitle={description} />

          <Box my={2} >
            {courses.map((course) => (
              <CourseItem key={course.slug} course={course} expanded={expanded} onChange={onChange} />

            ))}
          </Box>
        </Box>
      </Container>
    </AppLAyout >
  )
}

export { getStaticProps }
export default ExperiencesPage
