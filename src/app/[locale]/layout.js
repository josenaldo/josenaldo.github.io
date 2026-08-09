import { notFound } from 'next/navigation'

import { Box } from '@mui/material'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import Providers from '@/app/providers'
import Footer from '@/layouts/Footer'
import GetInTouch from '@/layouts/GetInTouch'
import Header from '@/layouts/Header'
import { routing } from '@/i18n/routing'

import '@/styles/globals.css'
import '@/styles/prism-theme.css'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }) {
    const { locale } = await params

    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    setRequestLocale(locale)

    return (
        <html lang={locale}>
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
            </head>
            <body>
                <NextIntlClientProvider>
                    <Providers>
                        <Box>
                            <Header />

                            <Box component="main">{children}</Box>

                            <GetInTouch />
                            <Footer />
                        </Box>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
