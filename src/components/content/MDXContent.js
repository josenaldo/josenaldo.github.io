'use client'

import { Box, Divider } from '@mui/material'
import { MDXProvider } from '@mdx-js/react'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'
// import { Remark } from 'react-remark'
import Markdown from 'react-markdown'
import externalLinks from 'rehype-external-links'
import rehypePrism from 'rehype-prism-plus'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'

import Blockquote from '@/components/ui/Blockquote'
import CodeBlock from '@/components/ui/CodeBlock'
import Link from '@/components/ui/Link'
import {
    MarkdownListItem,
    MarkdownOrderedList,
    MarkdownUnorderedList,
} from '@/components/ui/MarkdownList'
import ResponsiveImage from '@/components/ui/ResponsiveImage'
import remarkCodeMeta from '@/lib/remark-code-meta.mjs'

import styles from './MDXContent.module.css'

const MDXContent = ({ content }) => {
    const t = useTranslations('Common')

    const remarkPlugins = [
        remarkParse,
        remarkGfm,
        // Antes do rehype: é aqui que o meta da cerca ainda existe.
        remarkCodeMeta,
        [
            externalLinks,
            {
                target: '_blank',
                rel: ['nofollow', 'noopener', 'noreferrer'],
            },
        ],
    ]

    const rehypePlugins = [rehypeRaw, rehypeSlug, rehypePrism]

    const components = {
        img: ResponsiveImage,
        a: Link,
        pre: CodeBlock,
        // Sem override de `code`: o que existia aqui aplicava
        // `color="secondary"` (âmbar) a TODO código — inline e em bloco —
        // e sobrescrevia as cores de token do Prism. O inline passa a ser
        // estilizado por prism-theme.css.

        hr: (props) => <Divider sx={{ my: 2 }} {...props} />,
        blockquote: Blockquote,
        ol: MarkdownOrderedList,
        ul: MarkdownUnorderedList,
        li: MarkdownListItem,
        center: (props) => <Box sx={{ textAlign: 'center' }} {...props} />,
        table: (props) => (
            <Box className={styles.tableWrapper}>
                <Box component="table" className={styles.table} {...props} />
            </Box>
        ),
        thead: (props) => (
            <Box component="thead" className={styles.tableHead} {...props} />
        ),
        tbody: (props) => (
            <Box component="tbody" className={styles.tableBody} {...props} />
        ),
        tr: (props) => (
            <Box component="tr" className={styles.tableRow} {...props} />
        ),
        th: (props) => (
            <Box component="th" className={styles.tableHeaderCell} {...props} />
        ),
        td: (props) => (
            <Box component="td" className={styles.tableCell} {...props} />
        ),
    }

    return (
        <Box className={styles.markdownBody}>
            <MDXProvider>
                <Markdown
                    components={components}
                    remarkPlugins={remarkPlugins}
                    rehypePlugins={rehypePlugins}
                    remarkRehypeOptions={{
                        allowDangerousHtml: true,
                        footnoteLabel: t('footnoteLabel'),
                        footnoteBackLabel: t('footnoteBackLabel'),
                    }}
                    onError={(error) => {
                        console.error(t('mdxProcessingError'), error)
                    }}
                >
                    {content}
                </Markdown>
            </MDXProvider>
        </Box>
    )
}

MDXContent.propTypes = {
    content: PropTypes.string.isRequired,
}

export default MDXContent
