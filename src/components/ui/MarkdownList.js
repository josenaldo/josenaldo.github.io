import { Box } from '@mui/material'
import PropTypes from 'prop-types'

const nestedListStyles = {
    mt: 0.75,
    mb: 0.5,
}

const baseListStyles = {
    my: 1.5,
    pl: { xs: 3, md: 4 },
    listStylePosition: 'outside',
}

const sanitizeListProps = (props) => {
    const sanitizedProps = { ...props }
    delete sanitizedProps.node
    delete sanitizedProps.depth
    delete sanitizedProps.ordered
    delete sanitizedProps.checked
    delete sanitizedProps.index
    return sanitizedProps
}

const MarkdownOrderedList = ({ children, ...props }) => {
    const elementProps = sanitizeListProps(props)

    return (
        <Box
            component="ol"
            sx={{
                ...baseListStyles,
                listStyleType: 'decimal',
                '& > li::marker': {
                    color: 'secondary.light',
                    fontWeight: 600,
                },
                '& ol': {
                    ...nestedListStyles,
                    listStyleType: 'lower-alpha',
                },
                '& ul': {
                    ...nestedListStyles,
                    listStyleType: 'disc',
                },
            }}
            {...elementProps}
        >
            {children}
        </Box>
    )
}

const MarkdownUnorderedList = ({ children, ...props }) => {
    const elementProps = sanitizeListProps(props)

    return (
        <Box
            component="ul"
            sx={{
                ...baseListStyles,
                listStyleType: 'disc',
                '& > li::marker': {
                    color: 'secondary.light',
                },
                '& ul': {
                    ...nestedListStyles,
                    listStyleType: 'circle',
                },
                '& ol': {
                    ...nestedListStyles,
                    listStyleType: 'decimal',
                },
            }}
            {...elementProps}
        >
            {children}
        </Box>
    )
}

const MarkdownListItem = ({ children, ...props }) => {
    const elementProps = sanitizeListProps(props)

    return (
        <Box
            component="li"
            sx={{
                my: 0.5,
                pl: 0.5,
                '& > p': {
                    my: 0.5,
                },
            }}
            {...elementProps}
        >
            {children}
        </Box>
    )
}

MarkdownOrderedList.propTypes = {
    children: PropTypes.node.isRequired,
    depth: PropTypes.number,
    node: PropTypes.object,
    ordered: PropTypes.bool,
}

MarkdownUnorderedList.propTypes = {
    children: PropTypes.node.isRequired,
    depth: PropTypes.number,
    node: PropTypes.object,
    ordered: PropTypes.bool,
}

MarkdownListItem.propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.node.isRequired,
    index: PropTypes.number,
    node: PropTypes.object,
    ordered: PropTypes.bool,
}

export { MarkdownListItem, MarkdownOrderedList, MarkdownUnorderedList }
