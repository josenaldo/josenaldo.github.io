import { Box, Button } from '@mui/material'

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

export default DesktopMenu
