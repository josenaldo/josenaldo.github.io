import { Container } from '@mui/material'

import ContentView from '@/components/content/ContentView'
import AppLayout from '@/layouts/AppLayout'
import contentService from '@/services/content'

// TODO(Task 4): remover o locale explícito quando o App Router assumir o roteamento.
const getStaticPaths = async () => {
    const paths = contentService.getAllPostsPaths('en')
    return {
        paths,
        fallback: false,
    }
}

const getStaticProps = async ({ params }) => {
    const { slug } = params
    const post = contentService.getPostData('en', slug)

    return {
        props: {
            post,
        },
    }
}

const PostPage = ({ post }) => {
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
                    language={post.locale}
                    url={post.url}
                />
            </Container>
        </AppLayout>
    )
}

export { getStaticPaths, getStaticProps }
export default PostPage
