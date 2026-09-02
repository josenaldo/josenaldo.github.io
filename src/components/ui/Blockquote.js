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

const Blockquote = ({ children }) => {
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
