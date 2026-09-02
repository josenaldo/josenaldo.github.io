// Destino: src/components/ResultBlock.js — ARQUIVO NOVO.
//
// Corrige D-08: o bloco Result dos engagements mostrava rótulos de métrica em
// 11px em vez de números. O bloco Result é o único lugar da home onde o roxo
// vira superfície de leitura (#191233) — e o número é a coisa que a pessoa
// enxerga primeiro.
//
// Usado por: home/Engagements, /experiences (card expandido).

'use client'

import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const MONO = "'IBM Plex Mono', ui-monospace, monospace"
const DISPLAY = "'Space Grotesk', system-ui, sans-serif"

const ResultBlock = ({ label, items = [], body, size = 'lg' }) => (
    <Box
        sx={{
            bgcolor: '#191233',
            borderRadius: size === 'lg' ? '16px' : '14px',
            p: size === 'lg' ? '26px 28px' : '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
        }}
    >
        {label ? (
            <Typography
                component="p"
                sx={{
                    m: 0,
                    fontFamily: MONO,
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#B69BF0',
                }}
            >
                {label}
            </Typography>
        ) : null}

        {items.length > 0 ? (
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    columnGap: '40px',
                    rowGap: '20px',
                }}
            >
                {items.map((item) => (
                    <Box
                        key={item.caption}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                fontFamily: DISPLAY,
                                fontSize: size === 'lg' ? '28px' : '24px',
                                fontWeight: 700,
                                letterSpacing: '-.02em',
                                color: '#FFFFFF',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {item.value}
                            {item.confidence === 'measured' ? (
                                <Box
                                    component="span"
                                    aria-hidden="true"
                                    sx={{
                                        color: '#FFAA00',
                                        fontSize: '.5em',
                                        ml: '7px',
                                    }}
                                >
                                    ●
                                </Box>
                            ) : null}
                        </Box>
                        <Box
                            component="span"
                            sx={{ fontSize: '13px', color: '#A79BC4' }}
                        >
                            {item.caption}
                        </Box>
                    </Box>
                ))}
            </Box>
        ) : null}

        {body ? (
            <Typography
                component="p"
                sx={{
                    m: 0,
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: '#C9C1DE',
                    maxWidth: '90ch',
                }}
            >
                {body}
            </Typography>
        ) : null}
    </Box>
)

ResultBlock.propTypes = {
    label: PropTypes.string,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            confidence: PropTypes.string,
        })
    ),
    body: PropTypes.string,
    size: PropTypes.oneOf(['lg', 'sm']),
}

export default ResultBlock
