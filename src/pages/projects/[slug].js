import { Container } from '@mui/material'

import ContentView from '@/components/content/ContentView'
import AppLayout from '@/layouts/AppLayout'
import contentService from '@/services/content'

const getStaticPaths = async () => {
    const paths = contentService.getAllProjectsPaths()
    return {
        paths,
        fallback: false,
    }
}

const getStaticProps = async ({ params }) => {
    const { slug } = params
    const project = contentService.getProjectData(slug)

    return {
        props: {
            project,
        },
    }
}

const ProjectPage = ({ project }) => {
    return (
        <AppLayout
            title={project.title}
            description={project.description}
            image={project?.image || null}
            url={project.url}
        >
            <Container>
                <ContentView
                    content={project.body.raw}
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    date={project.date}
                    author={project.author}
                    category={project.category}
                    url={project.url}
                />
            </Container>
        </AppLayout>
    )
}

export { getStaticPaths, getStaticProps }
export default ProjectPage
