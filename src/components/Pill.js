'use client'

import { Box } from '@mui/material'
import PropTypes from 'prop-types'

const MONO = "'IBM Plex Mono', ui-monospace, monospace"
const DISPLAY = "'Space Grotesk', system-ui, sans-serif"

const TONE = {
    neutral: { color: '#C6CCD8', bgcolor: 'rgba(255,255,255,.05)' },
    // O mock usa dois neutros, não um. `neutral` (#C6CCD8) é a pílula que
    // carrega um VALOR e se lê junto com o conteúdo: nome de cliente, item de
    // stack, filtro de categoria. `quiet` (#98A0B0) é a pílula que carrega um
    // RÓTULO e deve recuar: kicker de card, período, estado.
    quiet: { color: '#98A0B0', bgcolor: 'rgba(255,255,255,.05)' },
    amber: { color: '#FFAA00', bgcolor: 'rgba(255,170,0,.12)' },
    purple: { color: '#B69BF0', bgcolor: 'rgba(136,85,223,.12)' },
    active: { color: '#0B0E13', bgcolor: '#FFAA00' },
}

// O mock não tem um padding de pílula, tem quatro, e a diferença é legível:
// quanto mais a pílula é rótulo, mais apertada ela é.
const PADDING = {
    xs: '5px 11px', // tipo de projeto
    sm: '6px 12px', // kicker de card, categoria de post, estado
    md: '6px 14px', // nome, período, item de prova
    lg: '8px 14px', // filtro de categoria do blog
}

const FONT_SIZE = { xs: '11px', sm: '11px', md: '12px', lg: '12px' }

const Pill = ({
    tone = 'neutral',
    as = 'mono',
    uppercase = false,
    size = 'md',
    // O `letter-spacing` varia por uso no mock (.06em nos filtros, .1em nas
    // categorias, .12em nos estados, .14em nos kickers). Fixá-lo em .1em
    // achatava essa distinção.
    tracking = '.1em',
    component = 'span',
    sx,
    children,
    ...rest
}) => (
    <Box
        component={component}
        {...rest}
        // `sx` por último e mesclado: sem isso o `sx` de quem chama era
        // sobrescrito pelo objeto abaixo, e os poucos casos em que o mock foge
        // da escala (a pílula de 13px do cartucho de prova, o 7px 13px de
        // /hiring e /about) não tinham como ser expressos.
        sx={[{
            ...TONE[tone],
            display: 'inline-flex',
            alignItems: 'center',
            flex: 'none',
            fontFamily: as === 'display' ? DISPLAY : MONO,
            fontSize: as === 'display' ? '16px' : FONT_SIZE[size],
            fontWeight: 600,
            letterSpacing: uppercase ? tracking : 'normal',
            textTransform: uppercase ? 'uppercase' : 'none',
            lineHeight: 1,
            borderRadius: '999px',
            p: PADDING[size],
            whiteSpace: 'nowrap',
        }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
        {children}
    </Box>
)

Pill.propTypes = {
    tone: PropTypes.oneOf(['neutral', 'quiet', 'amber', 'purple', 'active']),
    as: PropTypes.oneOf(['mono', 'display']),
    uppercase: PropTypes.bool,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
    tracking: PropTypes.string,
    component: PropTypes.elementType,
    sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
    children: PropTypes.node.isRequired,
}

export default Pill
