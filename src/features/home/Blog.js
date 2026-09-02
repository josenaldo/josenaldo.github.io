'use client'

import { useState } from 'react'

import { Box, Divider, Stack, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import CallToAction from '@/components/CallToAction'
import PostListItem from '@/components/content/PostListItem'
import Pagination from '@/components/Pagination'
import Section from '@/components/Section'

const POSTS_PER_PAGE = 6

const Blog = ({ posts }) => {
    const t = useTranslations('Home.blog')
    const tCommon = useTranslations('Common')
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE)

    return (
        <Section surface="band" rhythm="hero">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 5,
                }}
            >
                <Typography variant="h2">{t('title')}</Typography>
                <Stack divider={<Divider />} sx={{ width: '100%' }}>
                    {paginatedPosts.map((post) => (
                        <PostListItem
                            key={post.url}
                            title={post.title}
                            text={post.description}
                            author={post.author}
                            date={post.date}
                            image={post.image}
                            url={post.url}
                            category={post.category}
                            moreLinkText={tCommon('readPost')}
                        />
                    ))}
                </Stack>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    compact
                />
                <CallToAction href="/blog" ariaLabel={t('allPostsAria')}>
                    {t('allPostsCta')}
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
