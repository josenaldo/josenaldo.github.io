'use client'

import { Box, Typography } from '@mui/material'

import { Link } from '@/i18n/navigation'

const Logo = () => {
    return (
        <Box
            component={Link}
            href="/"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 'none',
                textDecoration: 'none',
            }}
        >
            <Box
                aria-hidden="true"
                sx={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '4px',
                    bgcolor: 'primary.main',
                    flex: 'none',
                }}
            />

            <Typography
                noWrap
                sx={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#E9ECF2',
                }}
            >
                Josenaldo Matos
            </Typography>
        </Box>
    )
}

export default Logo
