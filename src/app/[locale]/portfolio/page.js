import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params

    return {
        title: 'Portfolio',
        alternates: {
            canonical: `/${locale}/portfolio`,
            languages: {
                en: '/en/portfolio',
                pt: '/pt/portfolio',
            },
        },
    }
}

export default async function PortfolioPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    return (
        <div>
            <h1>Portfolio</h1>
        </div>
    )
}
