// Corrige spec/03-paginas-internas.md §6: era o ContentCard genérico
// (compartilhado com posts) com imagem de capa. A spec pede explicitamente
// "sem screenshot decorativo" — projeto pessoal não tem imagem de
// marketing, a stack é a informação.
//
// `type`/`stack`/`sourceUrl` são campos opcionais no schema
// (contentlayer.config.js): a pílula/link só aparece quando o campo existir.
//
// `href` é a página de detalhe no próprio site; `url` é o site externo do
// projeto. Até 2026-09, o card mandava o visitante direto para fora — as onze
// páginas de detalhe existiam, estavam no sitemap, e não tinham um único link
// apontando para elas. O título e a ação primária agora levam para o caso.

'use client'

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import Pill from '@/components/Pill'
import { Link } from '@/i18n/navigation'

const ProjectCard = ({
    title,
    description,
    href,
    url,
    type,
    stack,
    sourceUrl,
}) => {
    const t = useTranslations('Common')

    return (
        <Box
            sx={{
                bgcolor: '#14181F',
                borderRadius: '18px',
                p: '26px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow:
                    '0 1px 2px rgba(0,0,0,.4), 0 18px 40px -28px rgba(0,0,0,1)',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                }}
            >
                <Typography
                    component={href ? Link : 'h2'}
                    href={href || undefined}
                    sx={{
                        m: 0,
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        fontSize: '21px',
                        fontWeight: 600,
                        lineHeight: 1.25,
                        letterSpacing: '-.01em',
                        color: '#E9ECF2',
                        textDecoration: 'none',
                        '&:hover': { color: '#CDBBF8' },
                    }}
                >
                    {title}
                </Typography>
                {type ? (
                    <Pill tone="amber" size="xs" uppercase>
                        {type}
                    </Pill>
                ) : null}
            </Box>

            <Typography
                component="p"
                sx={{ m: 0, fontSize: '15px', lineHeight: 1.6, color: '#98A0B0' }}
            >
                {description}
            </Typography>

            {stack && stack.length > 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        pt: '6px',
                    }}
                >
                    {stack.map((item) => (
                        <Pill key={item} tone="neutral" size="sm">
                            {item}
                        </Pill>
                    ))}
                </Box>
            ) : null}

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    mt: 'auto',
                    pt: '6px',
                }}
            >
                {href ? (
                    <Box
                        component={Link}
                        href={href}
                        sx={{
                            fontSize: '14px',
                            color: '#B69BF0',
                            textDecoration: 'none',
                            '&:hover': { color: '#CDBBF8' },
                        }}
                    >
                        {t('readCase')}
                    </Box>
                ) : null}
                {url ? (
                    <Box
                        component="a"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '14px',
                            color: '#7C8494',
                            textDecoration: 'none',
                            '&:hover': { color: '#98A0B0' },
                        }}
                    >
                        {t('viewProject')}
                    </Box>
                ) : null}
                {sourceUrl ? (
                    <Box
                        component="a"
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            fontSize: '14px',
                            color: '#7C8494',
                            textDecoration: 'none',
                            '&:hover': { color: '#98A0B0' },
                        }}
                    >
                        {t('source')}
                    </Box>
                ) : null}
            </Box>
        </Box>
    )
}

ProjectCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    href: PropTypes.string,
    url: PropTypes.string,
    type: PropTypes.string,
    stack: PropTypes.arrayOf(PropTypes.string),
    sourceUrl: PropTypes.string,
}

export default ProjectCard
