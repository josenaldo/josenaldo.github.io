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
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        gap: { xs: 2, md: 8, lg: 12 },
                    }}
                >
                    <Logo />

                    {/* Nav + EN/PT + botão viajam juntos como um bloco só,
                    logo depois do logo (gap fixo, não `space-between`) — o
                    bloco não estica até a borda direita do canvas, sobra
                    espaço depois do botão, igual ao mock. */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
                    </Box>
                </Toolbar>
            </Box>

            <ReadingProgressBar />
        </AppBar>
    )
}

export default Header
