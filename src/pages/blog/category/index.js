import { Box, Button, Card, CardActions, CardContent, Container, Typography } from '@mui/material'

import ContentTitle from '@/components/content/ContentTitle'
import AppLayout from '@/layouts/AppLayout'
import contentService from '@/services/content'

const getStaticProps = async () => {
    const categories = contentService.getAllCategories()
    return { props: { categories } }
}

const CategoriesPage = ({ categories }) => {
    const title = 'Categories'
    const description = 'Browse posts by category'

    return (
        <AppLayout
            title={title}
            description={description}
            url="/blog/category"
        >
            <Container>
                <Box sx={{ my: 5 }}>
                    <ContentTitle title={title} subtitle={description} />
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
                                                duration:
                                                    theme.transitions.duration
                                                        .short,
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
                                        {cat.count}{' '}
                                        {cat.count === 1 ? 'post' : 'posts'}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ px: 2, pb: 2 }}>
                                    <Button
                                        component="a"
                                        href={`/blog/category/${cat.slug}`}
                                        aria-label={`View posts in ${cat.name}`}
                                    >
                                        View posts
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Container>
        </AppLayout>
    )
}

export { getStaticProps }
export default CategoriesPage
