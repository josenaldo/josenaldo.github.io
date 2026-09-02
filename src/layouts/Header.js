import React from 'react'

import { AppBar, Box, Container, NoSsr, Toolbar } from '@mui/material'

import BookACallButton from '@/components/BookACallButton'
import Logo from '@/components/Logo'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import pages, { aboutSubNav } from '@/data/pages'
import DesktopMenu from '@/layouts/DesktopMenu'
import MobileMenu from '@/layouts/MobileMenu'

const Header = () => {
    return (
        <AppBar position="sticky">
            <Container>
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        gap: 1,
                    }}
                >
                    <Logo />

                    <DesktopMenu pages={pages} aboutSubNav={aboutSubNav} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BookACallButton size="small" />

                        <NoSsr>
                            <MobileMenu
                                pages={pages}
                                aboutSubNav={aboutSubNav}
                            />
                        </NoSsr>
                    </Box>
                </Toolbar>
            </Container>

            <ReadingProgressBar />
        </AppBar>
    )
}

export default Header
