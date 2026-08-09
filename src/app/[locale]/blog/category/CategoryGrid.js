'use client'

import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from '@mui/material'
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
                    md: '1fr 1fr 1fr',
                },
                gap: 3,
                my: 5,
            }}
        >
            {categories.map((cat) => (
                <Card
                    key={cat.slug}
                    elevation={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: (theme) =>
                            theme.transitions.create(
                                ['transform', 'box-shadow'],
                                {
                                    duration: theme.transitions.duration.short,
                                }
                            ),
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 6,
                        },
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" component="h3">
                            {cat.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            {t('postCount', { count: cat.count })}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                        <Button
                            component={Link}
                            href={`/blog/category/${cat.slug}`}
                            aria-label={t('viewPostsAria', {
                                category: cat.name,
                            })}
                        >
                            {t('viewPosts')}
                        </Button>
                    </CardActions>
                </Card>
            ))}
        </Box>
    )
}

export default CategoryGrid
