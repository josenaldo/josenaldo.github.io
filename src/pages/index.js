import { Box, Button } from '@mui/material'

import AppLayout from '@/layouts/AppLayout'

import Hero from '@/features/home/Hero'
import About from '@/features/home/About'
import Experience from '@/features/home/Experience'
import Portfolio from '@/features/home/Portfolio'
import Services from '@/features/home/Services'
import Testimonial from '@/features/home/Testimonial'
import Blog from '@/features/home/Blog'
import Footer from '@/layouts/Footer'

import contentService from '@/services/content'

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
      <Hero />
      <About />
      <Experience experiences={experiences} />
      <Portfolio projects={projects} />
      <Services services={services} />
      <Testimonial testimonials={testimonials} />
      <Blog posts={posts} />
    </AppLayout>
  )
}
