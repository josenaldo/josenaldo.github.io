import { Box, Button } from '@mui/material'
import Hero from '@/features/home/Hero'
import About from '@/features/home/About'
import Experience from '@/features/home/Experience'
import Portfolio from '@/features/home/Portfolio'
import Services from '@/features/home/Services'
import Testimonial from '@/features/home/Testimonial'
import Blog from '@/features/home/Blog'
import GetInTouch from '@/features/home/GetInTouch'

import contentService from '@/services/content'

export async function getStaticProps() {
  const experiences = contentService.lastExperiences(4)
  const projects = contentService.lastProjects(6)
  const testimonials = contentService.getTestimonials()
  const posts = contentService.getSortedPosts(6)

  return { props: { experiences, projects, testimonials, posts } }
}

export default function Home({ experiences, projects, testimonials, posts }) {
  return (
    <Box>
      <Hero />
      <About />
      <Experience experiences={experiences} />
      <Portfolio projects={projects} />
      {/* <Services /> */}
      <Testimonial testimonials={testimonials} />
      <Blog posts={posts} />
      <GetInTouch />
    </Box>
  )
}
