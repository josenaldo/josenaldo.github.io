// Destino: src/components/PageHeader.js — ARQUIVO NOVO.
//
// O cabeçalho de toda página interna. Hoje cada página monta o seu, com
// tamanho e alinhamento diferentes (D-02 vale para as internas também).
//
// Regra: h1 44px (52px quando a página é de leitura: post e About), lead
// 18–19px em max-width 70–74ch, alinhados à esquerda, e uma fila opcional de
// pílulas abaixo. Nada centralizado.

'use client'

import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const PageHeader = ({ title, lead, children, size = 'md' }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography
            component="h1"
            sx={{
                m: 0,
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize:
                    size === 'lg'
                        ? { xs: '36px', md: '52px' }
                        : { xs: '32px', md: '44px' },
                lineHeight: size === 'lg' ? 1.06 : 1.08,
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
                    fontSize: { xs: '17px', md: '18px' },
                    lineHeight: 1.55,
                    color: '#C6CCD8',
                    maxWidth: '74ch',
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
    children: PropTypes.node,
    size: PropTypes.oneOf(['md', 'lg']),
}

export default PageHeader
