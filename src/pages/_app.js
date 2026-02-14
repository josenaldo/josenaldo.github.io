import Head from 'next/head'

import '@/styles/globals.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import seoData from '@/data/SeoConfig'
import { DefaultSeo } from 'next-seo'

import theme from '@/styles/theme'
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ReCaptchaProvider } from 'next-recaptcha-v3'

const { SeoConfig } = seoData

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <DefaultSeo {...SeoConfig} />
      <CssBaseline />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* <GoogleReCaptchaProvider reCaptchaKey="6Lejh7glAAAAADkJrpGCuGozGzXHWfvCCcU3vQho"> */}
      <ReCaptchaProvider reCaptchaKey="[GTM-6Lejh7glAAAAADkJrpGCuGozGzXHWfvCCcU3vQho]">
        <Component {...pageProps} />
      </ReCaptchaProvider>
      {/* </GoogleReCaptchaProvider> */}
    </ThemeProvider>
  )
}

