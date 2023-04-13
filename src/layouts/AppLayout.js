import React from 'react'

import { Box } from '@mui/material'

import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'

const AppLayout = ({ children }) => {
  return (
    <div>
      <Header />

      <Box component="main">{children}</Box>

      <Footer />
    </div>
  )
}

export default AppLayout
