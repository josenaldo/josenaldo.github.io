import PropTypes from 'prop-types'
import { Box, Button } from '@mui/material'

const CallToAction = ({ children, href, ariaLabel }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: { xs: 'center', md: 'flex-start' },
        mt: 2,

      }}
    >
      <Button variant="contained" href={href} aria-label={ariaLabel}>
        {children}
      </Button>
    </Box>
  )
}

CallToAction.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
}

export default CallToAction
