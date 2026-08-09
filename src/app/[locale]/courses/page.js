import { Box, Container } from '@mui/material'
import { setRequestLocale } from 'next-intl/server'

import ContentTitle from '@/components/content/ContentTitle'
import { allCourses } from '@/features/courses/api/courses'
import { routing } from '@/i18n/routing'

import CoursesList from './CoursesList'

const title = 'Courses'
const description =
    'A detailed list of my courses, including the institution, completion date, workload, course link, and certificate link.'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params

    return {
        title,
        description,
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

    const courses = allCourses(locale).map((course) => ({
        slug: course.slug,
        name: course.name,
        completionDate: course.completionDate,
        institution: course.institution,
        workload: course.workload,
        courseLink: course.courseLink,
        certificateLink: course.certificateLink,
        body: { raw: course.body.raw },
    }))

    return (
        <Container>
            <Box>
                <ContentTitle title={title} subtitle={description} />
                <CoursesList courses={courses} />
            </Box>
        </Container>
    )
}
