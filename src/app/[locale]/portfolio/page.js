import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Portfolio' })

    return {
        title: t('title'),
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
    const t = await getTranslations({ locale, namespace: 'Portfolio' })

    return (
        <div>
            <h1>{t('title')}</h1>
        </div>
    )
}
