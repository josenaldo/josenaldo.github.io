import { Link as MuiLink } from '@mui/material'
import NextLink from 'next/link'

const Link = ({ href, children, color, sx, ...restProps }) => {
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
    <MuiLink component={NextLink} href={href} {...restProps} sx={{ ...sx, ...linkStyle }}>
      {children}
    </MuiLink>
  )
}

// Set default props
Link.defaultProps = {
  color: 'primary',
}

export default Link
