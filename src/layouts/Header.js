import React from 'react'

import { AppBar, Container, NoSsr, Toolbar } from '@mui/material'

import Logo from '@/components/Logo'
import DesktopMenu from '@/layouts/DesktopMenu'
import MobileMenu from '@/layouts/MobileMenu'

import pages from '@/data/pages'

const Header = () => {
  return (
    <AppBar position="static">
      <Container>
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

          <NoSsr>
            <MobileMenu pages={pages} />
          </NoSsr>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
