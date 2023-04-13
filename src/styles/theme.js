import { createTheme } from '@mui/material/styles'
import { orange } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9A67EA',
    },
    secondary: {
      main: '#64D8CB',
    },
    error: {
      main: '#EF9A9A',
    },
    warning: {
      main: '#FFCC80',
    },
    info: {
      main: '#90CAF9',
    },
    success: {
      main: '#A5D6A7',
    },
  },
})

theme.typography.h6 = { fontSize: 'var(--font-size-h6)' }
theme.typography.h5 = { fontSize: 'var(--font-size-h5)' }
theme.typography.h4 = { fontSize: 'var(--font-size-h4)' }
theme.typography.h3 = { fontSize: 'var(--font-size-h3)' }
theme.typography.h2 = { fontSize: 'var(--font-size-h2)' }
theme.typography.h1 = { fontSize: 'var(--font-size-h1)' }

export default theme
