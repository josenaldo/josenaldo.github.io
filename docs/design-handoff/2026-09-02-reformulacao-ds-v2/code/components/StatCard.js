// Destino: src/components/StatCard.js — ARQUIVO NOVO.
//
// Métrica sem "antes": só valor + legenda. Usada na grade de evidência da
// página /hiring (4 colunas) e em qualquer lugar onde o "antes" já está na
// legenda ("(was 70)").

'use client'

import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const DISPLAY = "'Space Grotesk', system-ui, sans-serif"

const StatCard = ({ value, caption, confidence, size = 'lg' }) => (
    <Box
        sx={{
            bgcolor: '#14181F',
            borderRadius: '16px',
            p: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow:
                '0 1px 2px rgba(0,0,0,.4), 0 14px 30px -22px rgba(0,0,0,.9)',
        }}
    >
        <Box
            component="span"
            sx={{
                fontFamily: DISPLAY,
                fontSize: size === 'lg' ? '34px' : '28px',
                fontWeight: 700,
                letterSpacing: '-.02em',
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
            }}
        >
            {value}
            {confidence === 'measured' ? (
                <Box
                    component="span"
                    aria-hidden="true"
                    sx={{ color: '#FFAA00', fontSize: '.55em', ml: '8px' }}
                >
                    ●
                </Box>
            ) : null}
        </Box>
        <Typography
            component="p"
            sx={{ m: 0, fontSize: '14px', lineHeight: 1.5, color: '#98A0B0' }}
        >
            {caption}
        </Typography>
    </Box>
)

StatCard.propTypes = {
    value: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    confidence: PropTypes.oneOf(['measured', 'counted', 'remembered']),
    size: PropTypes.oneOf(['lg', 'sm']),
}

export default StatCard
