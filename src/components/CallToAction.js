import { Box, Button } from '@mui/material'
import PropTypes from 'prop-types'

const CallToAction = ({ children, href, ariaLabel, variant = 'outlined' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: { xs: 'center', md: 'flex-start' },
                mt: 2,
            }}
        >
            <Button variant={variant} href={href} aria-label={ariaLabel}>
                {children}
            </Button>
        </Box>
    )
}

CallToAction.defaultProps = {
    variant: 'contained',
}

CallToAction.propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string,
    variant: PropTypes.string,
}

export default CallToAction
