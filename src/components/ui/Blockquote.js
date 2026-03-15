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
                bgcolor: 'background.quote',
                color: 'text.quote',
                py: 2,
                px: { xs: 2, md: 4 },
                my: 2,
                mx: { xs: 0, md: 2 },
                borderRadius: '0 8px 8px 0',
                borderLeft: '5px solid',
                borderColor: 'secondary.light',
                fontStyle: 'italic',
                '& p': {
                    my: 1,
                },
            }}
        >
            {quoteChildren}
            {citation && (
                <Box
                    component="footer"
                    sx={{
                        mt: 1,
                        fontStyle: 'normal',
                        fontSize: '0.9em',
                        color: 'text.secondary',
                        '& cite': {
                            fontStyle: 'normal',
                            fontWeight: 500,
                        },
                        '&::before': {
                            content: '"— "',
                        },
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
