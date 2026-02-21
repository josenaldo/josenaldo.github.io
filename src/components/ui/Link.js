import NextLink from 'next/link'

import { Link as MuiLink } from '@mui/material'
import PropTypes from 'prop-types'

const Link = ({ href, children, color = 'secondary', sx, ...restProps }) => {
    const linkStyle = {
        color: `${color}.main`,
        '&:hover': {
            color: `${color}.dark`,
        },
        '&:focus': {
            color: `${color}.light`,
        },
        textDecoration: 'none',
    }

    return (
        <MuiLink
            component={NextLink}
            href={href}
            {...restProps}
            sx={{ ...sx, ...linkStyle }}
        >
            {children}
        </MuiLink>
    )
}

// Set default props
Link.defaultProps = {
    color: 'primary',
}

Link.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
    sx: PropTypes.object,
}

export default Link
