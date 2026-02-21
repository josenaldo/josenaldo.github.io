import { Box, Chip, Typography } from '@mui/material'
import PropTypes from 'prop-types'

import CallToAction from '@/components/CallToAction'
import Section from '@/components/Section'
import skills from '@/data/skills'

const About = () => {
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
                <Typography variant="h2">About Me</Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        textAlign: 'center',

                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography variant="h5" component="h3">
                        Howdy!
                    </Typography>
                    <Typography variant="subtitle">
                        Hello! I&apos;m Josenaldo, a technology enthusiast with
                        over 20 years of experience. I love working with Java,
                        JavaScript, React, and NextJS. I always strive to stay
                        up-to-date. In my free time, I enjoy sharing my
                        knowledge through my blog. Let&apos;s have a chat about
                        technology and explore new opportunities together!
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        alignContent: 'space-between',
                        gap: 2,
                        width: '100%',
                    }}
                >
                    {skills.map((skill) => (
                        <Chip
                            key={skill}
                            label={skill}
                            variant="outlined"
                            color="secondary"
                        />
                    ))}
                </Box>
                <CallToAction href="/about">Know more</CallToAction>
            </Box>
        </Section>
    )
}

About.propTypes = {}

export default About
