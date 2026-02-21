import { Box, Container } from '@mui/material'

import ContentCard from '@/components/content/ContentCard'
import ContentTitle from '@/components/content/ContentTitle'
import AppLAyout from '@/layouts/AppLayout'
// import { getSortedPosts } from '@pog/data'
import contentService from '@/services/content'

const getStaticProps = async () => {
    const projects = contentService.getAllProjects()
    return { props: { projects } }
}

const ProjectsPage = ({ projects }) => {
    const title = 'Projects'
    const description =
        "My projects are a mix of personal projects and projects I've worked on professionally."
    const image = '/images/default.jpg'

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
                            alignItems: 'stretch',
                            gap: 3,
                            my: 5,
                        }}
                    >
                        {projects.map((project) => (
                            <ContentCard
                                title={project.title}
                                text={project.description}
                                url={project.url}
                                image={project.image}
                                key={project.url}
                                author={project.author}
                                date={project.date}
                                moreLinkText="View project"
                            />
                        ))}
                    </Box>
                </Box>
            </Container>
        </AppLAyout>
    )
}

export { getStaticProps }
export default ProjectsPage
