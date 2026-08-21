'use client'

import { useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'

import MDXContent from '@/components/content/MDXContent'
import Link from '@/components/ui/Link'
import { formatDate } from '@/shared/utils/date-format-utils'

function CourseItem({ course, expanded, onChange }) {
    const t = useTranslations('Courses')
    const id = `${course.slug}-id`
    const contentId = `${course.slug}-content`
    const headerId = `${course.slug}-header`

    return (
        <Accordion id={id} expanded={expanded === id} onChange={onChange(id)}>
            <AccordionSummary
                aria-controls={contentId}
                id={headerId}
                expandIcon={<ExpandMoreIcon />}
            >
                <Box display="flex" flexDirection="column" gap={0}>
                    <Typography variant="h6">{course.name}</Typography>
                    <Typography variant="caption">
                        {formatDate(course.completionDate)} |{' '}
                        {course.institution} |{' '}
                        {t('workloadHours', { hours: course.workload })}
                    </Typography>
                </Box>
            </AccordionSummary>

            <AccordionDetails>
                <Box display="flex" flexDirection="row" gap={2}>
                    {course.courseLink && (
                        <Link
                            href={course.courseLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Chip
                                label={t('courseLink')}
                                color="primary"
                                clickable
                            />
                        </Link>
                    )}
                    {course.certificateLink && (
                        <Link
                            href={course.certificateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Chip
                                label={t('certificate')}
                                color="primary"
                                clickable
                            />
                        </Link>
                    )}
                </Box>
                <MDXContent content={course.body.raw} />
            </AccordionDetails>
        </Accordion>
    )
}

const CoursesList = ({ courses }) => {
    const [expanded, setExpanded] = useState(false)

    const onChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false)
    }

    return (
        <Box my={2}>
            {courses.map((course) => (
                <CourseItem
                    key={course.slug}
                    course={course}
                    expanded={expanded}
                    onChange={onChange}
                />
            ))}
        </Box>
    )
}

export default CoursesList
