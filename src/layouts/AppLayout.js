import React from 'react'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'

const AppLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default AppLayout
