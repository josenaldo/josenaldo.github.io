
import { Box, Divider } from '@mui/material'

import { MDXProvider } from '@mdx-js/react'
import { Remark } from 'react-remark'

import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'

import externalLinks from 'rehype-external-links'
import rehypePrism from 'rehype-prism-plus'
import rehypeRaw from 'rehype-raw'

import Blockquote from '@/components/ui/Blockquote'
import Code from '@/components/ui/Code'
import Link from '@/components/ui/Link'
import ResponsiveImage from '@/components/ui/ResponsiveImage'

import styles from './MDXContent.module.css'

const MDXContent = ({ content }) => {
  const remarkPlugins = [
    remarkParse,
    remarkGfm,
    [
      externalLinks,
      {
        target: '_blank',
        rel: ['nofollow', 'noopener', 'noreferrer'],
      },
    ],
  ]

  const rehypePlugins = [rehypeRaw, rehypePrism]

  const components = {
    img: ResponsiveImage,
    a: Link,
    pre: Code,
    hr: (props) => <Divider sx={{ my: 2 }} {...props} />,
    blockquote: Blockquote,
    center: (props) => <Box sx={{ textAlign: 'center' }} {...props} />,
  }

  return (
    <Box className={styles.markdownBody}>
      <MDXProvider>
        <Remark
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          remarkRehypeOptions={{
            allowDangerousHtml: true,
            footnoteLabel: 'Notas de rodapé',
            footnoteBackLabel: 'Voltar ao conteúdo',
          }}
          rehypeReactOptions={{ components: components }}
          onError={(error) => {
            console.error(error)
          }}
        >
          {content}
        </Remark>
      </MDXProvider>
    </Box>
  )
}

export default MDXContent
