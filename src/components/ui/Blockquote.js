import React from 'react'

import { Box } from '@mui/material'
import PropTypes from 'prop-types'

const isCitationParagraph = (child) => {
    if (!React.isValidElement(child)) return false
    if (child.type !== 'p') return false
    const grandChildren = React.Children.toArray(child.props.children)
    return (
        grandChildren.length === 1 &&
        React.isValidElement(grandChildren[0]) &&
        grandChildren[0].type === 'em'
    )
}

const isIgnorableTextNode = (child) => {
    return typeof child === 'string' && child.trim().length === 0
}

// Nota de atualização, marcada no Markdown como um blockquote que começa com
// `[!UPDATE]`:
//
//     > [!UPDATE] Update · 3 Mar 2026
//     > O texto da nota.
//
// Sem o marcador, a nota herdava a superfície da CITAÇÃO — roxo, 22px — e
// competia com a citação de verdade do post. A sintaxe é a dos alerts do
// GitHub, então quem escreve já a reconhece, e é explícita: nada aqui adivinha
// pela palavra "Update", que mudaria de idioma para idioma.
const UPDATE_MARKER = /^\s*\[!UPDATE\]\s*/

const readUpdateNote = (children) => {
    const nodes = React.Children.toArray(children).filter(
        (child) => !isIgnorableTextNode(child)
    )
    const first = nodes[0]

    if (!React.isValidElement(first) || first.type !== 'p') return null

    const parts = React.Children.toArray(first.props.children)
    const head = parts[0]

    if (typeof head !== 'string' || !UPDATE_MARKER.test(head)) return null

    // A primeira linha depois do marcador é o rótulo; o resto é o corpo.
    const afterMarker = head.replace(UPDATE_MARKER, '')
    const breakAt = afterMarker.indexOf('\n')
    const label = (
        breakAt === -1 ? afterMarker : afterMarker.slice(0, breakAt)
    ).trim()
    const restOfHead = breakAt === -1 ? '' : afterMarker.slice(breakAt + 1)

    return {
        label,
        body: [restOfHead, ...parts.slice(1), ...nodes.slice(1)],
    }
}

const UpdateNote = ({ label, body }) => (
    <Box
        component="aside"
        sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: '16px',
            bgcolor: '#14181F',
            borderRadius: '16px',
            p: '22px 24px',
        }}
    >
        <Box
            component="span"
            sx={{
                flex: 'none',
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: '#FFAA00',
                whiteSpace: 'nowrap',
                pt: '3px',
            }}
        >
            {label}
        </Box>
        <Box
            sx={{
                fontSize: '15px',
                lineHeight: 1.65,
                color: '#98A0B0',
                '& p': { m: 0 },
            }}
        >
            {body}
        </Box>
    </Box>
)

UpdateNote.propTypes = {
    label: PropTypes.string.isRequired,
    body: PropTypes.node,
}

const Blockquote = ({ children }) => {
    const updateNote = readUpdateNote(children)

    if (updateNote) return <UpdateNote {...updateNote} />

    const childArray = React.Children.toArray(children)
    const normalizedChildren = childArray.filter(
        (child) => !isIgnorableTextNode(child)
    )
    const lastChild = normalizedChildren[normalizedChildren.length - 1]

    let quoteChildren = childArray
    let citation = null

    if (isCitationParagraph(lastChild) && normalizedChildren.length > 1) {
        const citationNodeIndex = childArray.lastIndexOf(lastChild)
        quoteChildren = childArray.slice(0, citationNodeIndex)
        const emElement = React.Children.toArray(lastChild.props.children)[0]
        citation = emElement.props.children
    }

    return (
        <Box
            component="blockquote"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#191233',
                color: '#E5DEF7',
                p: '24px 28px',
                m: 0,
                borderRadius: '16px',
                fontSize: '22px',
                lineHeight: 1.5,
                '& p': {
                    m: 0,
                },
                '& strong': {
                    color: '#FFFFFF',
                },
            }}
        >
            {quoteChildren}
            {citation && (
                <Box
                    component="footer"
                    sx={{
                        mt: '12px',
                        fontSize: '0.7em',
                        color: '#B69BF0',
                        '& cite': { fontStyle: 'normal', fontWeight: 500 },
                        '&::before': { content: '"— "' },
                    }}
                >
                    <cite>{citation}</cite>
                </Box>
            )}
        </Box>
    )
}

Blockquote.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Blockquote
