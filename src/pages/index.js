import { Box } from '@mui/material'
import dynamic from 'next/dynamic'

import AppLayout from '@/layouts/AppLayout'

import HeroSection from '@/features/home/Hero'
import AboutSection from '@/features/home/About'
import BlogSection from '@/features/home/Blog'
import PortfolioSection from '@/features/home/Portfolio'
import ServicesSection from '@/features/home/Services'
import TestimonialSection from '@/features/home/Testimonial'

import contentService from '@/services/content'

const ExperienceSection = dynamic(() => import('@/features/home/Experience'), {
  ssr: false,
  loading: () => <Box sx={{ minHeight: { xs: 420, md: 560 } }} />,
})

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

export async function getStaticProps() {
  // Important: Contentlayer documents include large fields (e.g. body.html/body.raw/_raw)
  // that should not be sent to the Home page. Only pass what the UI uses.
  const experiences = contentService.lastExperiences(4).map((experience) => ({
    period: experience.period,
    company: experience.company,
    title: experience.title,
    description: experience.description,
    location: experience.location,
  }))

  const projects = contentService.lastProjects(6).map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    projectUrl: project.projectUrl,
    image: project.image,
    imageThumb: getProjectHomeImage(project.image),
    url: project.url,
  }))

  const services = contentService.getServices().map((service) => ({
    title: service.title,
    description: service.description,
    icon: service.icon,
    image: service.image,
  }))

  const testimonials = contentService.getTestimonials().map((testimonial) => ({
    name: testimonial.name,
    position: testimonial.position,
    testimonial: testimonial.testimonial,
    image: testimonial.image,
  }))

  const posts = contentService.getSortedPosts(6).map((post) => ({
    title: post.title,
    description: post.description,
    author: post.author,
    date: post.date,
    image: post.image,
    url: post.url,
    category: post.category,
  }))

  return { props: { experiences, projects, testimonials, services, posts } }
}

export default function Home({ experiences, projects, testimonials, services, posts }) {
  return (
    <AppLayout
      title="Josenaldo Matos"
      description="Software Developer & Kidney Waster"
      image="/images/default.jpg"
      url="/"
    >
      <HeroSection />
      <AboutSection />
      <BlogSection posts={posts} />
      <ExperienceSection experiences={experiences} />
      <PortfolioSection projects={projects} />
      <ServicesSection services={services} />
      <TestimonialSection testimonials={testimonials} />
    </AppLayout>
  )
}
