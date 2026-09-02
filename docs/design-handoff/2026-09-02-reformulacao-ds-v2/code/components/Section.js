// Destino: src/components/Section.js — SUBSTITUI o arquivo atual.
//
// O que muda em relação ao atual:
//  - sai o <Container> do MUI (gutter próprio, causa margem dupla quando
//    aninhado — ver D-01 e D-13 do diagnóstico);
//  - o canvas passa a ser explícito: 1280px, gutter 40px (24px no mobile);
//  - o ritmo vertical passa a ser assimétrico (padTop != padBottom);
//  - `bleed` permite que a seção controle a própria margem lateral (usado pelo
//    cartucho de prova e pelo CTA final);
//  - nenhuma centralização de conteúdo. A Section nunca alinha os filhos.

'use client'

import { Box } from '@mui/material'
import PropTypes from 'prop-types'

export const SURFACE = {
    default: '#0B0E13',
    band: '#0E1218',
    strip: '#101419',
    paper: '#14181F',
    paperSoft: '#12161C',
    result: '#191233',
}

// No mobile todo degrau de ritmo cai um nível: 76 -> 56, 64 -> 48, 60 -> 44.
const mobilePad = (px) => Math.round(px * 0.74)

const Section = ({
    surface = 'default',
    padTop = 76,
    padBottom = 76,
    bleed = false,
    component = 'section',
    id,
    children,
}) => {
    const inner = bleed ? (
        children
    ) : (
        <Box
            sx={{
                maxWidth: '1280px',
                mx: 'auto',
                px: { xs: '24px', md: '40px' },
            }}
        >
            {children}
        </Box>
    )

    return (
        <Box
            component={component}
            id={id}
            sx={{
                bgcolor: SURFACE[surface],
                pt: {
                    xs: `${mobilePad(padTop)}px`,
                    md: `${padTop}px`,
                },
                pb: {
                    xs: `${mobilePad(padBottom)}px`,
                    md: `${padBottom}px`,
                },
            }}
        >
            {inner}
        </Box>
    )
}

Section.propTypes = {
    surface: PropTypes.oneOf(Object.keys(SURFACE)),
    padTop: PropTypes.number,
    padBottom: PropTypes.number,
    bleed: PropTypes.bool,
    component: PropTypes.string,
    id: PropTypes.string,
    children: PropTypes.node.isRequired,
}

export default Section
