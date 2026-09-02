'use client'

import { useRef, useState } from 'react'

import { Divider, Stack } from '@mui/material'
import { useTranslations } from 'next-intl'

import PostListItem from '@/components/content/PostListItem'
import Pagination from '@/components/Pagination'

const POSTS_PER_PAGE = 9

const PostGrid = ({ posts }) => {
    const t = useTranslations('Common')
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
            <Stack ref={gridRef} divider={<Divider />} sx={{ my: 5 }}>
                {paginatedPosts.map((post) => (
                    <PostListItem
                        title={post.title}
                        text={post.description}
                        url={post.url}
                        image={post.image}
                        key={post.url}
                        author={post.author}
                        date={post.date}
                        category={post.category}
                        moreLinkText={t('readPost')}
                    />
                ))}
            </Stack>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default PostGrid
