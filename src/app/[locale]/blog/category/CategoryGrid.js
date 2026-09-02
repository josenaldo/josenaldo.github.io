// Corrige a limpeza de spec/04-aceite.md §5: era MUI Card/CardActions/Button
// genéricos (o grep de `<Chip` e `Container` do §5 tinha essa rota como um
// dos poucos sobreviventes fora do que o handoff desenhou tela por tela).
// Mesmo tratamento de card das outras grades do site (`#14181F` r18).

'use client'

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

const CategoryGrid = ({ categories }) => {
    const t = useTranslations('Blog.category')

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: 'repeat(3, 1fr)',
                },
                gap: '16px',
            }}
        >
            {categories.map((cat) => (
                <Box
                    key={cat.slug}
                    component={Link}
                    href={`/blog/category/${cat.slug}`}
                    aria-label={t('viewPostsAria', { category: cat.name })}
                    sx={{
                        bgcolor: '#14181F',
                        borderRadius: '18px',
                        p: '22px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        textDecoration: 'none',
                        transition: 'background-color 120ms ease',
                        '&:hover': { bgcolor: '#191E27' },
                    }}
                >
                    <Typography
                        component="h3"
                        sx={{
                            m: 0,
                            fontFamily: "'Space Grotesk', system-ui, sans-serif",
                            fontSize: '21px',
                            fontWeight: 600,
                            color: '#FFFFFF',
                        }}
                    >
                        {cat.name}
                    </Typography>
                    <Typography
                        component="p"
                        sx={{ m: 0, fontSize: '14px', color: '#98A0B0' }}
                    >
                        {t('postCount', { count: cat.count })}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}

export default CategoryGrid
