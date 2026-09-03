'use client'

/**
 * CodeBlock — substitui src/components/ui/Code.js.
 *
 * O Code.js recebia o `<pre>` do react-markdown, DESCARTAVA todas as props e
 * embrulhava os filhos num segundo `<pre>`. Três consequências:
 *
 *   - o `className="language-java"` que o rehype-prism-plus põe no `<pre>` se
 *     perdia, então nenhum seletor `pre[class*='language-']` do prism-theme
 *     casava — o bloco saía sem superfície, sem raio e sem numeração;
 *   - saía `<pre>` dentro de `<pre>`;
 *   - o nome do arquivo e a linguagem não tinham onde aparecer.
 *
 * Aqui o `<pre>` original é preservado e só ganha a barra de cima. O estilo do
 * corpo continua em prism-theme.css.
 *
 * Origem: handoff/handoff-site/code/CodeBlock.js, no projeto do Claude Design,
 * adaptado aos tokens deste tema (o original usava `background.band`,
 * `accent.main` e `var(--font-mono)`, que não existem aqui).
 */

import { useState } from 'react'

import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

const MONO = "'IBM Plex Mono', ui-monospace, monospace"

// Só os que aparecem no blog. O resto cai no próprio nome da linguagem.
const LANGUAGE_LABEL = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    yml: 'yaml',
    golang: 'go',
}

const collectText = (node) => {
    if (node === null || node === undefined || node === false) return ''
    if (typeof node === 'string' || typeof node === 'number') return String(node)
    if (Array.isArray(node)) return node.map(collectText).join('')
    if (node.props?.children) return collectText(node.props.children)
    return ''
}

const CodeBlock = ({ children, className, ...rest }) => {
    const t = useTranslations('Common')
    const [copied, setCopied] = useState(false)

    // rehype-prism-plus escreve a linguagem no `<code>` filho;
    // rehype-code-meta acrescenta `data-title` no `<pre>`.
    const codeProps = children?.props ?? {}
    const language = (codeProps.className || className || '')
        .split(' ')
        .find((c) => c.startsWith('language-'))
        ?.replace('language-', '')

    // O título chega no `<code>` (é lá que o remark-rehype aplica as
    // hProperties), não no `<pre>`; o fallback cobre um pipeline que o
    // coloque no `<pre>`.
    const title = codeProps['data-title'] ?? rest['data-title']
    const showLanguage = Boolean(language) && language !== 'text'
    const labelled = Boolean(title) || showLanguage

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(collectText(children).trimEnd())
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
        } catch {
            // Área de transferência bloqueada: o bloco continua selecionável
            // à mão, então não vale interromper a leitura com um aviso.
        }
    }

    return (
        <Box
            component="figure"
            sx={{ my: '24px', mx: 0, display: 'flex', flexDirection: 'column' }}
        >
            {labelled && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        px: '18px',
                        py: '11px',
                        bgcolor: '#101419',
                        borderRadius: '14px 14px 0 0',
                        borderBottom: '1px solid rgba(255,255,255,.06)',
                    }}
                >
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                        {title && (
                            <Box
                                component="span"
                                sx={{
                                    fontFamily: MONO,
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '.12em',
                                    textTransform: 'uppercase',
                                    color: '#C6CCD8',
                                }}
                            >
                                {title}
                            </Box>
                        )}
                        {showLanguage && (
                            <Box
                                component="span"
                                sx={{
                                    fontFamily: MONO,
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    letterSpacing: '.1em',
                                    textTransform: 'uppercase',
                                    color: '#FFAA00',
                                    bgcolor: 'rgba(255,170,0,.12)',
                                    px: '9px',
                                    py: '4px',
                                    borderRadius: '999px',
                                }}
                            >
                                {LANGUAGE_LABEL[language] ?? language}
                            </Box>
                        )}
                    </Box>

                    <Box
                        component="button"
                        type="button"
                        onClick={copy}
                        aria-label={copied ? t('copied') : t('copyCode')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            border: 0,
                            cursor: 'pointer',
                            fontFamily: MONO,
                            fontSize: '11px',
                            color: copied ? '#FFAA00' : '#7C8494',
                            bgcolor: 'rgba(255,255,255,.05)',
                            px: '11px',
                            py: '5px',
                            borderRadius: '8px',
                            transition: 'color .12s, background-color .12s',
                            '&:hover': {
                                color: '#C6CCD8',
                                bgcolor: 'rgba(255,255,255,.09)',
                            },
                        }}
                    >
                        {copied ? (
                            <CheckIcon sx={{ fontSize: 13 }} />
                        ) : (
                            <ContentCopyIcon sx={{ fontSize: 13 }} />
                        )}
                        {copied ? t('copied') : t('copy')}
                    </Box>
                </Box>
            )}

            <Box
                component="pre"
                className={className}
                data-labelled={labelled ? 'true' : undefined}
                {...rest}
            >
                {children}
            </Box>
        </Box>
    )
}

CodeBlock.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
}

export default CodeBlock
