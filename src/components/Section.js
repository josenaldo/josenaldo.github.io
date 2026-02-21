import { Box, Container, Paper } from '@mui/material'
import PropTypes from 'prop-types'

const Section = ({ elevation, children, py = 8 }) => {
    return (
        <Box>
            <Paper
                elevation={elevation}
                sx={{
                    py: py,
                }}
            >
                <Container>{children}</Container>
            </Paper>
        </Box>
    )
}

Section.propTypes = {
    elevation: PropTypes.number,
    children: PropTypes.node.isRequired,
    py: PropTypes.number,
}

export default Section
