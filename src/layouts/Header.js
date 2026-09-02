import React from 'react'

import { AppBar, Box, NoSsr, Toolbar } from '@mui/material'

import BookACallButton from '@/components/BookACallButton'
import Logo from '@/components/Logo'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import pages, { aboutSubNav } from '@/data/pages'
import DesktopMenu from '@/layouts/DesktopMenu'
import MobileMenu from '@/layouts/MobileMenu'

const Header = () => {
    return (
        <AppBar position="sticky">
            <Box
                sx={{
                    maxWidth: '1280px',
                    mx: 'auto',
                    px: { xs: '24px', md: '40px' },
                }}
            >
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
                        <BookACallButton size="small" short />

                        <NoSsr>
                            <MobileMenu
                                pages={pages}
                                aboutSubNav={aboutSubNav}
                            />
                        </NoSsr>
                    </Box>
                </Toolbar>
            </Box>

            <ReadingProgressBar />
        </AppBar>
    )
}

export default Header
