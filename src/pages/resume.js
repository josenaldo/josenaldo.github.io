import { Container } from '@mui/material'

import ContentView from '@/components/content/ContentView'
import AppLayout from '@/layouts/AppLayout'
import contentService from '@/services/content'

const getStaticProps = async () => {
    // TODO(Task 4): remover o locale explícito quando o App Router assumir o roteamento.
    const page = contentService.getPageData('en', 'resume')

    return {
        props: {
            page,
        },
    }
}

const ResumePage = ({ page }) => {
    return (
        <AppLayout
            title={page.title}
            description={page.description}
            image={page?.image || null}
            url={page.url}
        >
            <Container>
                <ContentView
                    content={page.body.raw}
                    title={page.title}
                    description={page.description}
                    url={page.url}
                />
            </Container>
        </AppLayout>
    )
}

export { getStaticProps }
export default ResumePage
