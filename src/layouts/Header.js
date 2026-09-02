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
                    // `width: 100%` é obrigatório aqui: o AppBar do MUI é
                    // `display: flex; flex-direction: column`, e um item
                    // flex com `mx: 'auto'` mas sem largura explícita perde
                    // o stretch (a margem automática no eixo cruzado do flex
                    // sequestra o alinhamento) e encolhe pro conteúdo em vez
                    // de esticar até o `maxWidth` — foi assim que o header
                    // ficou mais estreito que o resto da página.
                    width: '100%',
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

                    {/* Nav + EN/PT + botão viajam juntos como um bloco só,
                    colado à direita do canvas — agora que o canvas do
                    header tem a mesma largura do resto da página,
                    `space-between` encosta esse bloco na mesma borda
                    direita onde termina o conteúdo (ex.: a foto do hero). */}
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
