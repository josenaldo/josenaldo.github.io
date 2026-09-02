'use client'

import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const NUMERAL_SX = {
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '.16em',
    textTransform: 'uppercase',
    color: '#FFAA00',
    lineHeight: 1,
}

const SectionHeader = ({ n, title, aside, variant = 'inline', size = 'lg' }) => {
    const titleSx =
        size === 'lg'
            ? { fontSize: { xs: '28px', md: '34px' }, fontWeight: 700 }
            : { fontSize: { xs: '22px', md: '26px' }, fontWeight: 700 }

    if (variant === 'spine') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {n ? (
                    <Typography component="span" sx={NUMERAL_SX}>
                        {n}
                    </Typography>
                ) : null}
                <Typography component="h2" variant="h2" sx={titleSx}>
                    {title}
                </Typography>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: '16px',
            }}
        >
            {n ? (
                <Typography component="span" sx={NUMERAL_SX}>
                    {n}
                </Typography>
            ) : null}
            <Typography component="h2" variant="h2" sx={titleSx}>
                {title}
            </Typography>
            {aside ? (
                <Typography
                    component="span"
                    sx={{
                        fontSize: '15px',
                        fontStyle: 'italic',
                        color: '#7C8494',
                    }}
                >
                    {aside}
                </Typography>
            ) : null}
        </Box>
    )
}

SectionHeader.propTypes = {
    n: PropTypes.string,
    title: PropTypes.string.isRequired,
    aside: PropTypes.string,
    variant: PropTypes.oneOf(['inline', 'spine']),
    size: PropTypes.oneOf(['lg', 'sm']),
}

export default SectionHeader
