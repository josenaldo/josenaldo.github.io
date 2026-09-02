'use client'

import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const MONO = "'IBM Plex Mono', ui-monospace, monospace"
const DISPLAY = "'Space Grotesk', system-ui, sans-serif"

const MetricCard = ({ label, before, after, unit, confidence }) => (
    <Box
        sx={{
            bgcolor: '#14181F',
            borderRadius: '16px',
            p: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow:
                '0 1px 2px rgba(0,0,0,.4), 0 14px 30px -22px rgba(0,0,0,.9)',
        }}
    >
        <Typography
            component="p"
            sx={{
                m: 0,
                fontFamily: MONO,
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: '#98A0B0',
                lineHeight: 1.3,
            }}
        >
            {label}
            {confidence === 'measured' ? (
                <Box
                    component="span"
                    aria-hidden="true"
                    sx={{ color: '#FFAA00', ml: '6px' }}
                >
                    ●
                </Box>
            ) : null}
        </Typography>

        <Box
            sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                minWidth: 0,
            }}
        >
            {before ? (
                <>
                    <Box
                        component="span"
                        sx={{
                            fontFamily: MONO,
                            fontSize: '15px',
                            color: '#7C8494',
                            textDecoration: 'line-through',
                            whiteSpace: 'nowrap',
                            flex: 'none',
                        }}
                    >
                        {before}
                    </Box>
                    <Box
                        component="span"
                        aria-hidden="true"
                        sx={{ color: '#FFAA00', fontSize: '14px' }}
                    >
                        →
                    </Box>
                </>
            ) : null}
            <Box
                component="span"
                sx={{
                    fontFamily: DISPLAY,
                    fontSize: '30px',
                    fontWeight: 700,
                    letterSpacing: '-.02em',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                }}
            >
                {after}
            </Box>
        </Box>

        {unit ? (
            <Typography
                component="p"
                sx={{ m: 0, fontSize: '13px', color: '#98A0B0' }}
            >
                {unit}
            </Typography>
        ) : null}
    </Box>
)

MetricCard.propTypes = {
    label: PropTypes.string.isRequired,
    before: PropTypes.string,
    after: PropTypes.string.isRequired,
    unit: PropTypes.string,
    confidence: PropTypes.oneOf(['measured', 'counted', 'remembered']),
}

export default MetricCard
