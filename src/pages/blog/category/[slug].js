import { useRef, useState } from 'react'

import { Box, Container } from '@mui/material'

import ContentCard from '@/components/content/ContentCard'
import ContentTitle from '@/components/content/ContentTitle'
import Pagination from '@/components/Pagination'
import AppLayout from '@/layouts/AppLayout'
import contentService from '@/services/content'

const POSTS_PER_PAGE = 9

const getStaticPaths = async () => {
    const paths = contentService.getAllCategoryPaths().map((slug) => ({
        params: { slug },
    }))
    return { paths, fallback: false }
}

const getStaticProps = async ({ params }) => {
    const { slug } = params
    const posts = contentService.getPostsByCategory(slug)
    const categories = contentService.getAllCategories()
    const category = categories.find((c) => c.slug === slug)

    return {
        props: {
            posts,
            categoryName: category?.name ?? slug,
            slug,
        },
    }
}

const CategoryPage = ({ posts, categoryName }) => {
    const title = `Category: ${categoryName}`
    const description = `All posts in the "${categoryName}" category`

    const [currentPage, setCurrentPage] = useState(1)
    const gridRef = useRef(null)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE)

    const handlePageChange = (page) => {
        setCurrentPage(page)
        gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <AppLayout
            title={title}
            description={description}
            url={`/blog/category/${encodeURIComponent(categoryName)}`}
        >
            <Container>
                <Box sx={{ my: 5 }}>
                    <ContentTitle title={title} subtitle={description} />
                    <Box
                        ref={gridRef}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr 1fr',
                                md: '1fr 1fr 1fr',
                            },
                            alignItems: 'stretch',
                            gap: 3,
                            my: 5,
                        }}
                    >
                        {paginatedPosts.map((post) => (
                            <ContentCard
                                title={post.title}
                                text={post.description}
                                showText
                                url={post.url}
                                image={post.image}
                                key={post.url}
                                author={post.author}
                                date={post.date}
                                category={post.category}
                                language={post.language}
                                moreLinkText="Read post"
                            />
                        ))}
                    </Box>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </Box>
            </Container>
        </AppLayout>
    )
}

export { getStaticPaths, getStaticProps }
export default CategoryPage
