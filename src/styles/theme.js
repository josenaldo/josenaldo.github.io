import { grey } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#8855DF',
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
        background: {
            default: '#121212',
            paper: '#1E1E1E',
            quote: '#2C2C2C',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#B0B0B0',
            quote: '#EEEEEE',
        }
    },
})

theme.typography.h6 = { fontSize: 'var(--font-size-h6)' }
theme.typography.h5 = { fontSize: 'var(--font-size-h5)' }
theme.typography.h4 = { fontSize: 'var(--font-size-h4)' }
theme.typography.h3 = { fontSize: 'var(--font-size-h3)' }
theme.typography.h2 = { fontSize: 'var(--font-size-h2)' }
theme.typography.h1 = { fontSize: 'var(--font-size-h1)' }

export default theme
