import { useState } from 'react'

import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

import CallToAction from '@/components/CallToAction'
import ContentCard from '@/components/content/ContentCard'
import Pagination from '@/components/Pagination'
import Section from '@/components/Section'

const POSTS_PER_PAGE = 6

const Blog = ({ posts }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE)

    return (
        <Section elevation={1}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 5,
                }}
            >
                <Typography variant="h2">Blog</Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: '1fr 1fr 1fr',
                        },
                        alignItems: 'stretch',
                        gap: 2,
                        width: '100%',
                    }}
                >
                    {paginatedPosts.map((post) => (
                        <ContentCard
                            key={post.url}
                            title={post.title}
                            text={post.description}
                            author={post.author}
                            date={post.date}
                            image={post.image}
                            url={post.url}
                            category={post.category}
                            language={post.language}
                            moreLinkText="Read post"
                            showText
                        />
                    ))}
                </Box>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    compact
                />
                <CallToAction href="/blog" ariaLabel="View all blog posts">
                    All posts
                </CallToAction>
            </Box>
        </Section>
    )
}

Blog.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            url: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            author: PropTypes.string,
            date: PropTypes.string,
            image: PropTypes.string,
            category: PropTypes.string,
            language: PropTypes.string,
        })
    ).isRequired,
}

export default Blog
