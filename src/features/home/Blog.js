import { Box, Container, Paper, Typography } from '@mui/material'
import Section from '@/components/Section'
import ContentCard from '@/components/content/ContentCard'

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
              date={post.date}
            />
          ))}
        </Box>
      </Box>
    </Section>
  )
}

export default Blog
