import { PropTypes } from 'prop-types'
import { Box, Container, Paper, Typography } from '@mui/material'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const ExperienceTimeline = ({ experiences, showEllipsis = false }) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Timeline position={matches ? 'right' : 'alternate'}>
      {experiences.map((experience, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            color="text.secondary"
            variant="h6"
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            {experience.date}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="secondary" />
            <TimelineConnector
              sx={{
                backgroundColor: 'secondary.main',
              }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="h5" component="h3">
              {experience.company}: {experience.title}
            </Typography>
            <Typography
              color="text.secondary"
              fontStyle="italic"
              fontSize="0.8rem"
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {experience.date}
            </Typography>
            <Typography>{experience.description}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}

      {showEllipsis && (
        <TimelineItem>
          <TimelineOppositeContent
            color="text.secondary"
            variant="h6"
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            ...
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>
            <Typography color="text.secondary">...</Typography>
          </TimelineContent>
        </TimelineItem>
      )}
    </Timeline>
  )
}

ExperienceTimeline.propTypes = {
  experiences: PropTypes.array.isRequired,
  showEllipsis: PropTypes.bool,
}

export default ExperienceTimeline
