import { setRequestLocale } from 'next-intl/server'

import seoConfigModule from '@/data/SeoConfig'
import BlogSection from '@/features/home/Blog'
import ClosingCtaSection from '@/features/home/ClosingCta'
import EngagementsSection from '@/features/home/Engagements'
import HeroSection from '@/features/home/Hero'
import HowIOperateSection from '@/features/home/HowIOperate'
import IsThisYouSection from '@/features/home/IsThisYou'
import ProofStripSection from '@/features/home/ProofStrip'
import PublicationsSection from '@/features/home/Publications'
import TestimonialSection from '@/features/home/Testimonial'
import WorkModesSection from '@/features/home/WorkModes'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

const { APP_TITLE, APP_DESCRIPTION } = seoConfigModule

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params

    return {
        title: APP_TITLE,
        description: APP_DESCRIPTION,
        alternates: {
            canonical: `/${locale}`,
            languages: {
                en: '/en',
                pt: '/pt',
            },
        },
        openGraph: {
            title: APP_TITLE,
            description: APP_DESCRIPTION,
            url: `/${locale}`,
        },
    }
}

export default async function HomePage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    // Important: Contentlayer documents include large fields (e.g. body.html/body.raw/_raw)
    // that should not be sent to client section components. Only pass what the UI uses.
    const testimonials = contentService
        .getTestimonials(locale)
        .map((testimonial) => ({
            name: testimonial.name,
            position: testimonial.position,
            testimonial: testimonial.testimonial,
            image: testimonial.image,
        }))

    const posts = contentService.getSortedPosts(locale).map((post) => ({
        title: post.title,
        description: post.description,
        author: post.author,
        date: post.date,
        image: post.image,
        url: post.url,
        category: post.category,
        language: post.locale,
    }))

    const workModes = contentService.getWorkModes(locale).map((mode) => ({
        name: mode.name,
        promise: mode.promise,
        bullets: mode.bullets,
        icon: mode.icon,
    }))

    const engagements = contentService
        .getEngagements(locale)
        .map((engagement) => ({
            title: engagement.title,
            role: engagement.role,
            period: engagement.period,
            arrived: engagement.arrived,
            built: engagement.built,
            result: engagement.result,
            translationKey: engagement.translationKey,
        }))

    return (
        <>
            <HeroSection />
            <ProofStripSection />
            <IsThisYouSection />
            <WorkModesSection workModes={workModes} />
            <EngagementsSection engagements={engagements} />
            <HowIOperateSection />
            <TestimonialSection testimonials={testimonials} />
            <BlogSection posts={posts} />
            <PublicationsSection />
            <ClosingCtaSection />
        </>
    )
}
