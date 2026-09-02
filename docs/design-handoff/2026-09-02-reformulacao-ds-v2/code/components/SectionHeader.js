// Destino: src/components/SectionHeader.js — ARQUIVO NOVO.
//
// Corrige D-03: não existia cabeçalho de seção no projeto, e por isso cada
// seção inventava o seu (sempre centralizado).
//
// Duas variantes, e só duas:
//  - "inline" (default): `01` âmbar + <h2>, na mesma linha de base, gap 16px.
//    Use quando o conteúdo abaixo ocupa a largura toda (cards em grid, lista).
//  - "spine": o cabeçalho é a coluna esquerda de um grid `360px 1fr`. O
//    componente renderiza apenas a coluna; o grid é montado pela seção.
//    Use quando o conteúdo é texto ou uma lista estreita.
//
// `aside` é o aparte em itálico ao lado do título (Testimonials).

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

const SectionHeader = ({
    n,
    title,
    aside,
    variant = 'inline',
    size = 'lg',
}) => {
    const titleSx =
        size === 'lg'
            ? { fontSize: { xs: '28px', md: '34px' }, fontWeight: 700 }
            : { fontSize: { xs: '22px', md: '26px' }, fontWeight: 700 }

    if (variant === 'spine') {
        return (
            <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
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
