import { Box, Button } from '@mui/material'

const DesktopMenu = ({ pages }) => {
  return (
    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
      {pages.map((page) => (
        <Button
          key={page.name}
          href={page.url}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          {page.name}
        </Button>
      ))}
    </Box>
  )
}

export default DesktopMenu
