import { notFound } from 'next/navigation'

import { Box } from '@mui/material'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import Providers from '@/app/providers'
import seoConfigModule from '@/data/SeoConfig'
import { routing } from '@/i18n/routing'
import FontLoader from '@/layouts/FontLoader'
import Footer from '@/layouts/Footer'
import Header from '@/layouts/Header'

import '@/styles/globals.css'
import '@/styles/prism-theme.css'

const { APP_NAME, APP_TITLE, APP_DESCRIPTION } = seoConfigModule

// Domínio canônico. A Task 7 é dona de `NEXT_PUBLIC_SITE_URL` e do workflow —
// aqui só se consome a variável, com este literal como fallback de dev.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://josenaldo.com.br'

// `og:locale` no formato IETF-com-underscore que o Open Graph espera
// (en_US / pt_BR), derivado do locale da rota — não mais cravado em
// `pt_BR` como no `SeoConfig` de quando o site era mono-idioma.
const OG_LOCALE_BY_LOCALE = {
    en: 'en_US',
    pt: 'pt_BR',
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export function generateViewport() {
    // `theme-color` sai por `viewport`, não por `metadata`, no App Router.
    return {
        themeColor: '#9A67EA',
    }
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const ogLocale = OG_LOCALE_BY_LOCALE[locale] ?? OG_LOCALE_BY_LOCALE.en

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            template: '%s | Josenaldo Matos',
            default: APP_TITLE,
        },
        description: APP_DESCRIPTION,
        openGraph: {
            type: 'website',
            siteName: APP_TITLE,
            locale: ogLocale,
            images: [
                {
                    url: '/images/default.jpg',
                    width: 1200,
                    height: 630,
                    alt: APP_TITLE,
                    type: 'image/jpeg',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            site: '@josenaldomatos',
            creator: '@josenaldomatos',
        },
        icons: {
            icon: [
                {
                    url: '/icons/manifest-icon-192.maskable.png',
                },
                {
                    url: '/icons/manifest-icon-512.maskable.png',
                    type: 'image/png',
                    sizes: '512x512',
                },
                {
                    url: '/icons/manifest-icon-192.maskable.png',
                    type: 'image/png',
                    sizes: '192x192',
                },
            ],
            shortcut: ['/icons/manifest-icon-192.maskable.png'],
        },
        manifest: '/manifest.json',
        other: {
            'application-name': APP_NAME,
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'default',
            'apple-mobile-web-app-title': APP_NAME,
            'format-detection': 'telephone=no',
            'mobile-web-app-capable': 'yes',
            'msapplication-config': '/icons/browserconfig.xml',
            'msapplication-TileColor': '#9A67EA',
            'msapplication-tap-highlight': 'no',
        },
    }
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
                <FontLoader />
            </head>
            <body>
                <NextIntlClientProvider>
                    <Providers>
                        <Box>
                            <Header />

                            <Box component="main">{children}</Box>

                            <Footer />
                        </Box>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
