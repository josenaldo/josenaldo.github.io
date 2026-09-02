'use client'

import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const TITLE_SX = {
    md: { fontSize: { xs: '32px', md: '44px' }, lineHeight: 1.08 },
    lg: { fontSize: { xs: '34px', md: '48px' }, lineHeight: 1.08 },
    reading: { fontSize: { xs: '36px', md: '52px' }, lineHeight: 1.06 },
}

const LEAD_SX = {
    md: { fontSize: { xs: '17px', md: '18px' }, maxWidth: '74ch' },
    lg: { fontSize: { xs: '17px', md: '19px' }, maxWidth: '62ch' },
    reading: { fontSize: { xs: '18px', md: '20px' }, maxWidth: '70ch' },
}

const PageHeader = ({ title, lead, leadWidth, children, size = 'md' }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography
            component="h1"
            sx={{
                m: 0,
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                ...TITLE_SX[size],
                fontWeight: 700,
                letterSpacing: '-.03em',
                color: '#FFFFFF',
            }}
        >
            {title}
        </Typography>

        {lead ? (
            <Typography
                component="p"
                sx={{
                    m: 0,
                    ...LEAD_SX[size],
                    lineHeight: 1.55,
                    color: '#C6CCD8',
                    ...(leadWidth ? { maxWidth: leadWidth } : null),
                    textWrap: 'pretty',
                }}
            >
                {lead}
            </Typography>
        ) : null}

        {children ? (
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    mt: '4px',
                }}
            >
                {children}
            </Box>
        ) : null}
    </Box>
)

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    lead: PropTypes.string,
    leadWidth: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.oneOf(['md', 'lg', 'reading']),
}

export default PageHeader
