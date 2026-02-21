import { Box, Button } from '@mui/material'
import PropTypes from 'prop-types'

const DesktopMenu = ({ pages }) => {
    return (
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
                <Button key={page.name} href={page.url} sx={{ color: 'white' }}>
                    {page.name}
                </Button>
            ))}
        </Box>
    )
}

DesktopMenu.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        })
    ).isRequired,
}

export default DesktopMenu
