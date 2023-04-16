import React from 'react'

import { Box } from '@mui/material'

import { NextSeo } from 'next-seo'

import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import GetInTouch from '@/layouts/GetInTouch'

const AppLayout = ({ children, title, description, image, url }) => {
  const og = React.useMemo(() => {
    const openGraph = {
      title: title,
      description: description,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}${image}`,
          width: '1200px',
          height: '630px',
          alt: title,
        },
      ],
    }
    return openGraph
  }, [title, description, image])

  return (
    <Box>
      <NextSeo title={title} description={description} openGraph={og} />

      <Header />

      <Box component="main">{children}</Box>

      <GetInTouch />
      <Footer />
    </Box>
  )
}

export default AppLayout
