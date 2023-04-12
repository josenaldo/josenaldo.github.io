import { Typography } from '@mui/material'

const Logo = () => {
  return (
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="/"
      sx={{
        mr: 2,
        fontWeight: 700,
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      Josenaldo Matos
    </Typography>
  )
}

export default Logo
