// Corrige spec/03-paginas-internas.md §2: linha de post era Box genérico
// column/row com Divider entre itens; vira card `#14181F` r18, grid
// `200px 1fr 150px`, sem divisor (o espaçamento é o gap da lista).

'use client'

import { Box, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import ContentCardImage from '@/components/content/ContentCardImage'
import Pill from '@/components/Pill'
import { Link } from '@/i18n/navigation'
import { categoryLabel } from '@/lib/categoryLabel'
import { formatShortDate } from '@/lib/formatDate'

const PostListItem = ({ title, text, url, image, date, category }) => {
    const locale = useLocale()
    const t = useTranslations('Common')
    const tBlog = useTranslations('Blog')

    return (
        <Box
            component={Link}
            href={url}
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '200px 1fr 150px' },
                gap: { xs: '12px', md: '24px' },
                alignItems: 'center',
                p: '16px',
                borderRadius: '18px',
                bgcolor: '#14181F',
                textDecoration: 'none',
                boxShadow:
                    '0 1px 2px rgba(0,0,0,.4), 0 14px 30px -22px rgba(0,0,0,.9)',
                transition: 'background-color 120ms ease',
                '&:hover': { bgcolor: '#191E27' },
            }}
        >
            <Box
                sx={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    bgcolor: '#0E1218',
                }}
            >
                <ContentCardImage
                    image={image}
                    alt={title}
                    aspectRatio="16/10"
                />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    minWidth: 0,
                }}
            >
                <Typography
                    component="h2"
                    sx={{
                        m: 0,
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        fontSize: '23px',
                        fontWeight: 600,
                        lineHeight: 1.25,
                        color: '#FFFFFF',
                    }}
                >
                    {title}
                </Typography>
                {text ? (
                    <Typography
                        component="p"
                        sx={{
                            m: 0,
                            fontSize: '15px',
                            lineHeight: 1.55,
                            color: '#98A0B0',
                            maxWidth: '70ch',
                        }}
                    >
                        {text}
                    </Typography>
                ) : null}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', md: 'column' },
                    alignItems: { xs: 'center', md: 'flex-end' },
                    justifyContent: { xs: 'space-between', md: 'flex-start' },
                    gap: '10px',
                }}
            >
                {category ? (
                    <Pill tone="amber" uppercase size="sm">
                        {categoryLabel(tBlog, category)}
                    </Pill>
                ) : null}
                <Typography
                    component="span"
                    sx={{
                        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                        fontSize: '12px',
                        color: '#7C8494',
                    }}
                >
                    {formatShortDate(new Date(date), locale)}
                </Typography>
                <Typography
                    component="span"
                    sx={{ fontSize: '14px', color: '#B69BF0' }}
                >
                    {t('readShort')} →
                </Typography>
            </Box>
        </Box>
    )
}

PostListItem.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    url: PropTypes.string.isRequired,
    image: PropTypes.string,
    date: PropTypes.string,
    category: PropTypes.string,
}

export default PostListItem
