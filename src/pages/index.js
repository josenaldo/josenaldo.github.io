import { Box, Button } from '@mui/material'
import Hero from '@/features/home/Hero'
import About from '@/features/home/About'
import Experience from '@/features/home/Experience'
import Portfolio from '@/features/home/Portfolio'
import Services from '@/features/home/Services'
import Testimonial from '@/features/home/Testimonial'
import Blog from '@/features/home/Blog'
import GetInTouch from '@/features/home/GetInTouch'

export default function Home() {
  return (
    <Box>
      <Hero />
      <About />
      <Experience />
      <Portfolio />
      <Services />
      <Testimonial />
      <Blog />
      <GetInTouch />
    </Box>
  )
}
