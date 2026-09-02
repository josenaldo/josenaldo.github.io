'use client'

import { Fragment, useState } from 'react'

import { Box, Button, Menu, MenuItem } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import { Link, usePathname } from '@/i18n/navigation'
import LanguageSwitcher from '@/layouts/LanguageSwitcher'

const isActivePage = (pathname, url) =>
    url === '/' ? pathname === '/' : pathname.startsWith(url)

const pillSx = (active) => ({
    color: '#FFFFFF',
    borderRadius: 999,
    px: 2,
    fontWeight: active ? 500 : 400,
    bgcolor: active ? 'rgba(255,255,255,.06)' : 'transparent',
    '&:hover': {
        bgcolor: 'rgba(255,255,255,.08)',
    },
})

const DesktopMenu = ({ pages, aboutSubNav }) => {
    const t = useTranslations('Nav')
    const pathname = usePathname()
    const [anchorEl, setAnchorEl] = useState(null)

    const aboutActive =
        isActivePage(pathname, '/about') ||
        aboutSubNav.some((item) => isActivePage(pathname, item.url))

    const handleOpenAboutMenu = (event) => setAnchorEl(event.currentTarget)
    const handleCloseAboutMenu = () => setAnchorEl(null)

    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
            }}
        >
            {pages.map((page) =>
                page.name === 'about' ? (
                    <Fragment key={page.name}>
                        <Button
                            onClick={handleOpenAboutMenu}
                            aria-label={t('aboutSubNavLabel')}
                            aria-haspopup="true"
                            aria-expanded={Boolean(anchorEl)}
                            sx={pillSx(aboutActive)}
                        >
                            {t(page.name)}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseAboutMenu}
                        >
                            <MenuItem
                                component={Link}
                                href={page.url}
                                onClick={handleCloseAboutMenu}
                            >
                                {t(page.name)}
                            </MenuItem>
                            {aboutSubNav.map((item) => (
                                <MenuItem
                                    key={item.name}
                                    component={Link}
                                    href={item.url}
                                    onClick={handleCloseAboutMenu}
                                >
                                    {t(item.name)}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Fragment>
                ) : (
                    <Button
                        key={page.name}
                        component={Link}
                        href={page.url}
                        sx={pillSx(isActivePage(pathname, page.url))}
                    >
                        {t(page.name)}
                    </Button>
                )
            )}

            <LanguageSwitcher />
        </Box>
    )
}

DesktopMenu.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        })
    ).isRequired,
    aboutSubNav: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        })
    ).isRequired,
}

export default DesktopMenu
