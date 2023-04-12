import React from 'react'

import { AppBar, Container, Toolbar } from '@mui/material'

import Logo from '@/components/Logo'
import DesktopMenu from '@/layouts/DesktopMenu'
import MobileMenu from '@/layouts/MobileMenu'

import pages from '@/data/pages'

const Header = () => {
  return (
    <header>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: { xs: 'flex-end', md: 'space-between' },
              width: '100%',
            }}
          >
            <Logo />

            <DesktopMenu pages={pages} />

            <MobileMenu pages={pages} />
          </Toolbar>
        </Container>
      </AppBar>
    </header>
  )
}

export default Header
