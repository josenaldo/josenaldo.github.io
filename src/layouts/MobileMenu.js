'use client'

import React from 'react'

import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import {
    Box,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import { Link, usePathname } from '@/i18n/navigation'
import LanguageSwitcher from '@/layouts/LanguageSwitcher'

const isActivePage = (pathname, url) =>
    url === '/' ? pathname === '/' : pathname.startsWith(url)

const MobileMenu = ({ pages, aboutSubNav }) => {
    const t = useTranslations('Nav')
    const pathname = usePathname()
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const [aboutOpen, setAboutOpen] = React.useState(false)

    const handleOpenNavMenu = () => {
        setDrawerOpen(true)
    }

    const handleCloseNavMenu = () => {
        setDrawerOpen(false)
    }

    const handleToggleAbout = () => {
        setAboutOpen((open) => !open)
    }

    return (
        <Box
            sx={{
                display: { xs: 'flex', md: 'none' },
            }}
        >
            <IconButton
                size="large"
                aria-label={t('siteMenuLabel')}
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
            >
                <MenuIcon />
            </IconButton>

            <SwipeableDrawer
                anchor="right"
                open={drawerOpen}
                onClose={handleCloseNavMenu}
                onOpen={handleOpenNavMenu}
                sx={{
                    display: { xs: 'flex', md: 'none' },
                }}
            >
                <List>
                    {pages.map((page) =>
                        page.name === 'about' ? (
                            <React.Fragment key={page.name}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href={page.url}
                                        selected={isActivePage(
                                            pathname,
                                            page.url
                                        )}
                                        onClick={handleCloseNavMenu}
                                    >
                                        <ListItemIcon>
                                            {page.icon ? (
                                                <page.icon />
                                            ) : (
                                                <InboxIcon />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={t(page.name)} />
                                    </ListItemButton>
                                    <IconButton
                                        onClick={handleToggleAbout}
                                        aria-label={t('aboutSubNavLabel')}
                                        aria-expanded={aboutOpen}
                                    >
                                        {aboutOpen ? (
                                            <ExpandLessIcon />
                                        ) : (
                                            <ExpandMoreIcon />
                                        )}
                                    </IconButton>
                                </ListItem>
                                <Collapse in={aboutOpen} timeout="auto">
                                    <List disablePadding>
                                        {aboutSubNav.map((item) => (
                                            <ListItem
                                                key={item.name}
                                                disablePadding
                                            >
                                                <ListItemButton
                                                    component={Link}
                                                    href={item.url}
                                                    selected={isActivePage(
                                                        pathname,
                                                        item.url
                                                    )}
                                                    onClick={handleCloseNavMenu}
                                                    sx={{ pl: 4 }}
                                                >
                                                    <ListItemIcon>
                                                        {item.icon ? (
                                                            <item.icon />
                                                        ) : (
                                                            <InboxIcon />
                                                        )}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={t(item.name)}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        ) : (
                            <ListItem key={page.url} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href={page.url}
                                    selected={isActivePage(pathname, page.url)}
                                    onClick={handleCloseNavMenu}
                                >
                                    <ListItemIcon>
                                        {page.icon ? (
                                            <page.icon />
                                        ) : (
                                            <InboxIcon />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText primary={t(page.name)} />
                                </ListItemButton>
                            </ListItem>
                        )
                    )}
                </List>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <LanguageSwitcher />
                </Box>
            </SwipeableDrawer>
        </Box>
    )
}

MobileMenu.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            icon: PropTypes.elementType,
        })
    ).isRequired,
    aboutSubNav: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            icon: PropTypes.elementType,
        })
    ).isRequired,
}

export default MobileMenu
