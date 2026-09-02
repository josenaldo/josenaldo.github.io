'use client'

import { Box } from '@mui/material'
import PropTypes from 'prop-types'

const MONO = "'IBM Plex Mono', ui-monospace, monospace"
const DISPLAY = "'Space Grotesk', system-ui, sans-serif"

const TONE = {
    neutral: { color: '#C6CCD8', bgcolor: 'rgba(255,255,255,.05)' },
    amber: { color: '#FFAA00', bgcolor: 'rgba(255,170,0,.12)' },
    purple: { color: '#B69BF0', bgcolor: 'rgba(136,85,223,.12)' },
    active: { color: '#0B0E13', bgcolor: '#FFAA00' },
}

const Pill = ({
    tone = 'neutral',
    as = 'mono',
    uppercase = false,
    size = 'md',
    component = 'span',
    children,
    ...rest
}) => (
    <Box
        component={component}
        {...rest}
        sx={{
            ...TONE[tone],
            display: 'inline-flex',
            alignItems: 'center',
            flex: 'none',
            fontFamily: as === 'display' ? DISPLAY : MONO,
            fontSize: size === 'sm' ? '11px' : as === 'display' ? '16px' : '12px',
            fontWeight: 600,
            letterSpacing: uppercase ? '.1em' : 'normal',
            textTransform: uppercase ? 'uppercase' : 'none',
            lineHeight: 1,
            borderRadius: '999px',
            p: size === 'sm' ? '6px 12px' : '7px 14px',
            whiteSpace: 'nowrap',
        }}
    >
        {children}
    </Box>
)

Pill.propTypes = {
    tone: PropTypes.oneOf(['neutral', 'amber', 'purple', 'active']),
    as: PropTypes.oneOf(['mono', 'display']),
    uppercase: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md']),
    component: PropTypes.elementType,
    children: PropTypes.node.isRequired,
}

export default Pill
