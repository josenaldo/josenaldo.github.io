// Destino: src/app/[locale]/page.js — SUBSTITUI o arquivo atual.
//
// Duas mudanças em relação ao atual:
//  1. <PublicationsSection /> sai (o conteúdo virou a coluna direita de
//     BlogSection — ver features/home/Blog.js). Delete o arquivo
//     src/features/home/Publications.js.
//  2. testimonials/posts/workModes/engagements continuam sendo filtrados aqui
//     (o comentário original sobre não vazar body.html do Contentlayer segue
//     válido) — mas `workModes` passa a carregar `kicker`.
//
// A ORDEM das seções não muda. Ela já estava correta; o problema era a
// composição de cada uma.

import { setRequestLocale } from 'next-intl/server'

import seoConfigModule from '@/data/SeoConfig'
import BlogSection from '@/features/home/Blog'
import ClosingCtaSection from '@/features/home/ClosingCta'
import EngagementsSection from '@/features/home/Engagements'
import HeroSection from '@/features/home/Hero'
import HowIOperateSection from '@/features/home/HowIOperate'
import IsThisYouSection from '@/features/home/IsThisYou'
import ProofStripSection from '@/features/home/ProofStrip'
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
            languages: { en: '/en', pt: '/pt' },
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

    // Contentlayer inclui campos grandes (body.html/body.raw/_raw) que não
    // devem trafegar para os componentes de cliente. Só o que a UI usa.
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
        date: post.date,
        url: post.url,
        category: post.category,
    }))

    const workModes = contentService.getWorkModes(locale).map((mode) => ({
        name: mode.name,
        kicker: mode.kicker ?? null,
        promise: mode.promise,
        bullets: mode.bullets,
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
            <ClosingCtaSection />
        </>
    )
}
