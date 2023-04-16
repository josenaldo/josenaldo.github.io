import { Box, Container } from '@mui/material'

import ContentTitle from '@/components/content/ContentTitle'
import ContentCard from '@/components/content/ContentCard'

// import { getSortedPosts } from '@pog/data'
import contentService from '@/services/content'
import AppLAyout from '@/layouts/AppLayout'

const getStaticProps = async () => {
  const posts = contentService.getSortedPosts()
  return { props: { posts } }
}

const BlogPage = ({ posts }) => {
  const title = 'Nephro Nerd Chronicles'
  const description =
    "Explore Nephro Nerd Chronicles: Josenaldo's fusion of software development and kidney health insights. Be inspired, learn, and connect – one byte at a time!"
  const image = '/images/pages/blog.jpg'

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
            {posts.map((post) => (
              <ContentCard
                title={post.title}
                text={post.description}
                url={post.url}
                image={post.image}
                key={post.url}
                author={post.author}
                date={post.date}
                category={post.category}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </AppLAyout>
  )
}

export { getStaticProps }
export default BlogPage
