import { setRequestLocale } from 'next-intl/server'

import AboutSection from '@/features/home/About'
import BlogSection from '@/features/home/Blog'
import ExperienceSection from '@/features/home/Experience'
import HeroSection from '@/features/home/Hero'
import PortfolioSection from '@/features/home/Portfolio'
import ServicesSection from '@/features/home/Services'
import TestimonialSection from '@/features/home/Testimonial'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

const getProjectHomeImage = (imagePath) => {
    if (!imagePath) return imagePath

    const fileName = imagePath.split('/').pop()
    const baseName = fileName?.replace(/\.[^.]+$/, '')
    const isPrint = imagePath.includes('/prints/')

    if (!baseName) return imagePath

    return isPrint
        ? `/images/projects/thumbs/prints-${baseName}.webp`
        : `/images/projects/thumbs/${baseName}.webp`
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function HomePage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    // Important: Contentlayer documents include large fields (e.g. body.html/body.raw/_raw)
    // that should not be sent to client section components. Only pass what the UI uses.
    const experiences = contentService
        .lastExperiences(locale, 4)
        .map((experience) => ({
            period: experience.period,
            company: experience.company,
            title: experience.title,
            description: experience.description,
            location: experience.location,
        }))

    const projects = contentService.lastProjects(locale, 6).map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        projectUrl: project.projectUrl,
        image: project.image,
        imageThumb: getProjectHomeImage(project.image),
        url: project.url,
    }))

    const services = contentService.getServices(locale).map((service) => ({
        title: service.title,
        description: service.description,
        icon: service.icon,
        image: service.image,
    }))

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

    const skills = contentService
        .getAllSkillsByCategory()
        .map(({ group, color, skills }) => ({
            group,
            color,
            skills: skills.map(({ name, firstContact }) => ({
                name,
                firstContact,
            })),
        }))

    return (
        <>
            <HeroSection />
            <AboutSection skills={skills} />
            <BlogSection posts={posts} />
            <ExperienceSection experiences={experiences} />
            <PortfolioSection projects={projects} />
            <ServicesSection services={services} />
            <TestimonialSection testimonials={testimonials} />
        </>
    )
}
