import { Container } from '@mui/material'

import AppLayout from '@/layouts/AppLayout'
import ContentView from '@/components/content/ContentView'

import contentService from '@/services/content'

const getStaticProps = async () => {
  const page = contentService.getPageData('/resume')

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
