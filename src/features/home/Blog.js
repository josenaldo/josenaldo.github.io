// Corrige D-11 e D-12 juntos.
//
// A seção "Recent writing" passa a ser um grid `1fr 380px`: à esquerda TRÊS
// linhas compactas de post, à direita o card "Three places I write" — que
// antes era uma seção inteira (features/home/Publications.js).
//
// ATENÇÃO — duas remoções que fazem parte desta mudança:
//  1. `src/features/home/Publications.js` DEIXA DE EXISTIR. O conteúdo vive
//     aqui, como coluna.
//  2. a paginação sai da home. A home mostra três posts e um link "All posts →".
//     Paginar na home fazia a pessoa navegar o blog dentro da home.
//
// A linha de post não usa mais PostListItem (imagem + resumo + autor): na home
// o post é um índice, não um cartão. PostListItem continua em uso em /blog.

'use client'

import { Box, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import Section from '@/components/Section'
import SectionHeader from '@/components/SectionHeader'
import publications from '@/data/publications'
import { Link } from '@/i18n/navigation'
import { categoryLabel } from '@/lib/categoryLabel'
import { formatShortDate } from '@/lib/formatDate'

const POSTS_ON_HOME = 3

const MONO = "'IBM Plex Mono', ui-monospace, monospace"

const Blog = ({ posts }) => {
    const t = useTranslations('Home.blog')
    const tPublications = useTranslations('Home.publications')
    const tBlog = useTranslations('Blog')
    const locale = useLocale()
    const visiblePosts = posts.slice(0, POSTS_ON_HOME)

    return (
        <Section surface="band" padTop={76} padBottom={76}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' },
                    gap: { xs: '32px', lg: '56px' },
                    alignItems: 'start',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        minWidth: 0,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            gap: '16px',
                        }}
                    >
                        <SectionHeader title={t('title')} size="sm" />
                        <Typography
                            component={Link}
                            href="/blog"
                            aria-label={t('allPostsAria')}
                            sx={{
                                flex: 'none',
                                fontSize: '14px',
                                color: '#B69BF0',
                                textDecoration: 'none',
                                '&:hover': { color: '#CDBBF8' },
                            }}
                        >
                            {t('allPostsCta')}
                            <Box
                                component="span"
                                aria-hidden="true"
                                sx={{ ml: '6px' }}
                            >
                                →
                            </Box>
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        {visiblePosts.map((post) => (
                            <Box
                                key={post.url}
                                component={Link}
                                href={post.url}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        md: '96px 1fr 120px',
                                    },
                                    gap: { xs: '6px', md: '20px' },
                                    alignItems: 'baseline',
                                    p: '18px 22px',
                                    borderRadius: '14px',
                                    bgcolor: '#14181F',
                                    textDecoration: 'none',
                                    transition: 'background-color 120ms ease',
                                    '&:hover': { bgcolor: '#191E27' },
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        fontFamily: MONO,
                                        fontSize: '12px',
                                        color: '#7C8494',
                                    }}
                                >
                                    {formatShortDate(new Date(post.date), locale)}
                                </Box>

                                <Box
                                    component="span"
                                    sx={{
                                        fontFamily:
                                            "'Space Grotesk', system-ui, sans-serif",
                                        fontSize: '19px',
                                        fontWeight: 500,
                                        lineHeight: 1.35,
                                        color: '#E9ECF2',
                                    }}
                                >
                                    {post.title}
                                </Box>

                                <Box
                                    component="span"
                                    sx={{
                                        fontFamily: MONO,
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        letterSpacing: '.1em',
                                        textTransform: 'uppercase',
                                        color: '#FFAA00',
                                        textAlign: { xs: 'left', md: 'right' },
                                    }}
                                >
                                    {categoryLabel(tBlog, post.category)}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Coluna direita: era features/home/Publications.js */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                        bgcolor: '#12161C',
                        borderRadius: '18px',
                        p: '26px',
                    }}
                >
                    <Typography
                        component="p"
                        sx={{
                            m: 0,
                            fontFamily: MONO,
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '.14em',
                            textTransform: 'uppercase',
                            color: '#98A0B0',
                        }}
                    >
                        {tPublications('title')}
                    </Typography>

                    {publications.map((publication) => {
                        const name = tPublications(`${publication.key}.name`)
                        const short = tPublications.has(
                            `${publication.key}.short`
                        )
                            ? tPublications(`${publication.key}.short`)
                            : tPublications(`${publication.key}.description`)

                        const linkProps = publication.external
                            ? {
                                  component: 'a',
                                  href: publication.href,
                                  target: '_blank',
                                  rel: 'noopener noreferrer',
                              }
                            : { component: Link, href: publication.href }

                        return (
                            <Box
                                key={publication.key}
                                {...linkProps}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    textDecoration: 'none',
                                    '&:hover span:first-of-type': {
                                        color: '#FFFFFF',
                                    },
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#E9ECF2',
                                        transition: 'color 120ms ease',
                                    }}
                                >
                                    {name}
                                </Box>
                                <Box
                                    component="span"
                                    sx={{
                                        fontSize: '14px',
                                        lineHeight: 1.55,
                                        color: '#7C8494',
                                    }}
                                >
                                    {short}
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
        </Section>
    )
}

Blog.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            url: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            date: PropTypes.string,
            category: PropTypes.string,
        })
    ).isRequired,
}

export default Blog
