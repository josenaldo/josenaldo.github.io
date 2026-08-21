'use client'

import { Typography } from '@mui/material'

import { Link } from '@/i18n/navigation'

const Logo = () => {
    return (
        <Typography
            noWrap
            component={Link}
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

Logo.propTypes = {}

export default Logo
