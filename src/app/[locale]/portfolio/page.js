import { setRequestLocale } from 'next-intl/server'

import PortfolioRedirect from '@/features/portfolio/PortfolioRedirect'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params

    return {
        alternates: {
            canonical: `/${locale}/projects`,
        },
    }
}

export default async function PortfolioPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    return <PortfolioRedirect />
}
