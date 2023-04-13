import PropTypes from 'prop-types'
import { Box, Button } from '@mui/material'

const CallToAction = ({ children, href }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: { xs: 'center', md: 'flex-start' },
        gap: 2,
        mt: 4,
      }}
    >
      <Button variant="contained" href={href}>
        {children}
      </Button>
    </Box>
  )
}

CallToAction.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
}

export default CallToAction
