import { Box } from '@mui/material'
import PropTypes from 'prop-types'

const Code = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'block',
                overflowX: 'auto',
                textWrap: 'none',
                bgcolor: 'background.paper',
                padding: '10px',
            }}
        >
            <Box
                component="pre"
                sx={{
                    padding: '10px',
                    margin: '0',
                }}
            >
                {children}
            </Box>
        </Box>
    )
}

Code.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Code
