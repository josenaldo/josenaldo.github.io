import { Box, Typography } from '@mui/material'

import CallToAction from '@/components/CallToAction'
import ContentCard from '@/components/content/ContentCard'
import Section from '@/components/Section'

const Blog = ({ posts }) => {
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
                    {posts.map((post) => (
                        <ContentCard
                            key={post.url}
                            title={post.title}
                            text={post.description}
                            author={post.author}
                            date={post.date}
                            image={post.image}
                            url={post.url}
                            category={post.category}
                            moreLinkText="Read post"
                            showText
                        />
                    ))}
                </Box>
                <CallToAction href="/blog" ariaLabel="View all blog posts">
                    All posts
                </CallToAction>
            </Box>
        </Section>
    )
}

export default Blog
