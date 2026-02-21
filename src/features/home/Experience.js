import dynamic from 'next/dynamic'

import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

import CallToAction from '@/components/CallToAction'
import Section from '@/components/Section'

const ExperienceTimeline = dynamic(
    () => import('@/components/ExperienceTimeline'),
    {
        ssr: false,
        loading: () => <Box sx={{ minHeight: { xs: 320, md: 420 } }} />,
    }
)

const Experience = ({ experiences }) => {
    return (
        <Section elevation={1}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h2">Experience</Typography>
                <Box>
                    <ExperienceTimeline
                        experiences={experiences}
                        showEllipsis
                    />
                </Box>
                <CallToAction
                    href="/experiences"
                    ariaLabel="View all experiences"
                >
                    All roles
                </CallToAction>
            </Box>
        </Section>
    )
}

Experience.propTypes = {
    experiences: PropTypes.arrayOf(
        PropTypes.shape({
            period: PropTypes.string.isRequired,
            company: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            location: PropTypes.string.isRequired,
        })
    ).isRequired,
}

export default Experience
