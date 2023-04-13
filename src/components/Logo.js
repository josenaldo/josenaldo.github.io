import { Typography } from '@mui/material'

const Logo = () => {
  return (
    <Typography
      noWrap
      component="a"
      href="/"
      sx={{
        fontSize: 'var(--font-size-h6)',
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
