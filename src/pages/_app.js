import Head from 'next/head'

import '@/styles/globals.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import seoData from '@/data/SeoConfig'
import { generateDefaultSeo } from 'next-seo/pages'

import theme from '@/styles/theme'

const { SeoConfig } = seoData

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Head>{generateDefaultSeo(SeoConfig)}</Head>
      <CssBaseline />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Component {...pageProps} />
    </ThemeProvider>
  )
}
