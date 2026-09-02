import { Box } from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import PageHeader from '@/components/PageHeader'
import Section from '@/components/Section'
import { allCourses } from '@/features/courses/api/courses'
import { routing } from '@/i18n/routing'

import CoursesList from './CoursesList'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Courses' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `/${locale}/courses`,
            languages: {
                en: '/en/courses',
                pt: '/pt/courses',
            },
        },
    }
}

export default async function CoursesPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: 'Courses' })

    const courses = allCourses(locale).map((course) => ({
        slug: course.slug,
        name: course.name,
        completionDate: course.completionDate,
        institution: course.institution,
        workload: course.workload,
        courseLink: course.courseLink,
        certificateLink: course.certificateLink,
    }))

    return (
        <Section surface="default" padTop={56} padBottom={48}>
            <PageHeader title={t('title')} lead={t('description')} />
            <Box sx={{ mt: '32px' }}>
                <CoursesList courses={courses} />
            </Box>
        </Section>
    )
}
