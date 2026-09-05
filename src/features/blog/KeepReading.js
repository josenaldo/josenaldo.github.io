// spec/03-paginas-internas.md §3, "Keep reading": faixa `band`, grid 1fr 1fr,
// dois cards horizontais com miniatura 110px.
//
// 'use client': passa `Link` como `component` de um Box — mesma fronteira
// RSC de Hero.js/CategoryFilters.js.

'use client'

import { Box, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import ContentCardImage from '@/components/content/ContentCardImage'
import { Link } from '@/i18n/navigation'
import { formatShortDate } from '@/lib/formatDate'

const KeepReading = ({ posts }) => {
    const t = useTranslations('Post')
    const locale = useLocale()

    if (posts.length === 0) return null

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Typography
                component="p"
                sx={{
                    m: 0,
                    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#98A0B0',
                }}
            >
                {t('keepReading')}
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: '16px',
                }}
            >
                {posts.map((post) => (
                    <Box
                        key={post.path}
                        component={Link}
                        href={post.path}
                        sx={{
                            display: 'flex',
                            gap: '16px',
                            p: '16px',
                            borderRadius: '16px',
                            bgcolor: '#14181F',
                            textDecoration: 'none',
                            transition: 'background-color 120ms ease',
                            '&:hover': { bgcolor: '#191E27' },
                        }}
                    >
                        <Box
                            sx={{
                                width: '110px',
                                flex: 'none',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                bgcolor: '#0E1218',
                            }}
                        >
                            <ContentCardImage
                                image={post.image}
                                alt={post.title}
                                aspectRatio="16/10"
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                component="span"
                                sx={{
                                    fontFamily:
                                        "'Space Grotesk', system-ui, sans-serif",
                                    fontSize: '17px',
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    color: '#E9ECF2',
                                }}
                            >
                                {post.title}
                            </Typography>
                            <Typography
                                component="span"
                                sx={{
                                    fontFamily:
                                        "'IBM Plex Mono', ui-monospace, monospace",
                                    fontSize: '12px',
                                    color: '#7C8494',
                                }}
                            >
                                {formatShortDate(new Date(post.date), locale)}
                                {post.category ? ` · ${post.category}` : ''}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

KeepReading.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            date: PropTypes.string,
            category: PropTypes.string,
            image: PropTypes.string,
        })
    ).isRequired,
}

export default KeepReading
