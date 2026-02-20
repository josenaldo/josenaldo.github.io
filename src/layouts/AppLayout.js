import React from 'react'

import { Box } from '@mui/material'

import Head from 'next/head'
import { generateNextSeo } from 'next-seo/pages'

import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import GetInTouch from '@/layouts/GetInTouch'

const AppLayout = ({ children, title, description, image, url }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://josenaldo.github.io'

  const og = React.useMemo(() => {
    const openGraph = {
      title: title,
      description: description,
      url: url,
      images: [
        {
          url: `${siteUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    }
    return openGraph
  }, [title, description, image, url, siteUrl])

  return (
    <Box>
      <Head>{generateNextSeo({ title, description, canonical: `${siteUrl}${url}`, openGraph: og })}</Head>

      <Header />

      <Box component="main">{children}</Box>

      <GetInTouch />
      <Footer />
    </Box>
  )
}

export default AppLayout
