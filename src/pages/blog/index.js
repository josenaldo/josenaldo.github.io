import { useRef, useState } from 'react'

import { Box, Container } from '@mui/material'

import ContentCard from '@/components/content/ContentCard'
import ContentTitle from '@/components/content/ContentTitle'
import Pagination from '@/components/Pagination'
import AppLAyout from '@/layouts/AppLayout'
import contentService from '@/services/content'

const POSTS_PER_PAGE = 9

const getStaticProps = async () => {
    const posts = contentService.getSortedPosts()
    return { props: { posts } }
}

const BlogPage = ({ posts }) => {
    const title = 'Nephro Nerd Chronicles'
    const description =
        "Explore Nephro Nerd Chronicles: Josenaldo's fusion of software development and kidney health insights. Be inspired, learn, and connect – one byte at a time!"
    const image = '/images/pages/blog.jpg'

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
        <AppLAyout
            title={title}
            description={description}
            image={image}
            url="/blog"
        >
            <Container>
                <Box
                    sx={{
                        my: 5,
                    }}
                >
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
        </AppLAyout>
    )
}

export { getStaticProps }
export default BlogPage
