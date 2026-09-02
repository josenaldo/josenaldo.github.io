'use client'

import { Box, Container } from '@mui/material'
import PropTypes from 'prop-types'

const RHYTHM = {
    block: '40px',
    section: { xs: '56px', md: '64px' },
    hero: '76px',
}

const Section = ({ surface = 'default', rhythm = 'section', children }) => {
    return (
        <Box
            sx={(theme) => ({
                bgcolor: theme.surface[surface],
                py: RHYTHM[rhythm],
            })}
        >
            <Container>{children}</Container>
        </Box>
    )
}

Section.propTypes = {
    surface: PropTypes.oneOf(['default', 'band', 'paper']),
    rhythm: PropTypes.oneOf(['block', 'section', 'hero']),
    children: PropTypes.node.isRequired,
}

export default Section
