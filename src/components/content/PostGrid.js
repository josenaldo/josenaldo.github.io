'use client'

import { useRef, useState } from 'react'

import { Box } from '@mui/material'

import ContentCard from '@/components/content/ContentCard'
import Pagination from '@/components/Pagination'

const POSTS_PER_PAGE = 9

const PostGrid = ({ posts }) => {
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
        <>
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
                        language={post.locale}
                        moreLinkText="Read post"
                    />
                ))}
            </Box>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default PostGrid
