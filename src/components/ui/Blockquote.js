import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const Blockquote = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                bgcolor: 'background.quote',
                color: 'text.quote',
                py: 1,
                px: 3,
                borderRadius: 2,
                borderLeft: '5px solid',
                borderColor: 'secondary.light',
            }}
        >
            <Typography variant="overline" fontStyle="italic" fontWeight="bold">
                {children}
            </Typography>
        </Box>
    )
}

Blockquote.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Blockquote
