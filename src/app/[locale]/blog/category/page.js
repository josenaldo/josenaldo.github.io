import { Box, Container } from '@mui/material'
import { setRequestLocale } from 'next-intl/server'

import ContentTitle from '@/components/content/ContentTitle'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

import CategoryGrid from './CategoryGrid'

const title = 'Categories'
const description = 'Browse posts by category'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params

    return {
        title,
        description,
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

    const categories = contentService.getAllCategories(locale).map((cat) => ({
        name: cat.name,
        slug: cat.slug,
        count: cat.count,
    }))

    return (
        <Container>
            <Box sx={{ my: 5 }}>
                <ContentTitle title={title} subtitle={description} />
                <CategoryGrid categories={categories} />
            </Box>
        </Container>
    )
}
