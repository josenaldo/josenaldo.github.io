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

export default theme
