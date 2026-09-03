import { Box } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import PageHeader from '@/components/PageHeader'
import Section from '@/components/Section'
import { routing } from '@/i18n/routing'
import { categoryLabel } from '@/lib/categoryLabel'
import contentService from '@/services/content'

import CategoryGrid from './CategoryGrid'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Blog.category' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `/${locale}/blog/category`,
            languages: {
                en: '/en/blog/category',
                pt: '/pt/blog/category',
            },
        },
    }
}

export default async function CategoriesPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: 'Blog.category' })
    const tBlog = await getTranslations({ locale, namespace: 'Blog' })

    const categories = contentService.getAllCategories(locale).map((cat) => ({
        // Mesmo rótulo dos filtros, das linhas de post e da trilha: esta era a
        // última tela que ainda mostrava o slug cru (`job-market`).
        name: categoryLabel(tBlog, cat.name),
        slug: cat.slug,
        count: cat.count,
    }))

    return (
        <Section surface="default" padTop={56} padBottom={48}>
            <PageHeader title={t('title')} lead={t('description')} />
            <Box sx={{ mt: '32px' }}>
                <CategoryGrid categories={categories} />
            </Box>
        </Section>
    )
}
