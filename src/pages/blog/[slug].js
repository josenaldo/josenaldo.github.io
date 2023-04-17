import { Box, Container } from '@mui/material'

// import { getAllPostsPaths, getPostData } from '@pog/data'

import AppLayout from '@/layouts/AppLayout'
import ContentView from '@/components/content/ContentView'
import ContentMeta from '@/components/content/ContentMeta'
import ContentCategory from '@/components/content/ContentCategory'

import contentService from '@/services/content'

const getStaticPaths = async () => {
  const paths = contentService.getAllPostsPaths()
  return {
    paths,
    fallback: false,
  }
}

const getStaticProps = async ({ params }) => {
  const { slug } = params
  const post = contentService.getPostData(slug)

  return {
    props: {
      post,
    },
  }
}

const PostPage = ({ post }) => {
  console.log('post', post)
  return (
    <AppLayout
      title={post.title}
      description={post.description}
      image={post?.image || null}
      url={post.url}
    >
      <Container>
        <ContentView
          content={post.body.raw}
          title={post.title}
          description={post.description}
          image={post.image}
          date={post.date}
          author={post.author}
          category={post.category}
          url={post.url}
        />
      </Container>
    </AppLayout>
  )
}

export { getStaticPaths, getStaticProps }
export default PostPage
