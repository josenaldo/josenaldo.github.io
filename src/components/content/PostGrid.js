'use client'

import { useRef, useState } from 'react'

import { Box } from '@mui/material'

import PostListItem from '@/components/content/PostListItem'
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
                sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
                {paginatedPosts.map((post) => (
                    <PostListItem
                        title={post.title}
                        text={post.description}
                        url={post.url}
                        image={post.image}
                        key={post.url}
                        date={post.date}
                        category={post.category}
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
