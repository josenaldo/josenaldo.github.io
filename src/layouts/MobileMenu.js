'use client'

import React from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import {
    Box,
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

import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/layouts/LanguageSwitcher'

const MobileMenu = ({ pages }) => {
    const t = useTranslations('Nav')
    const [drawerOpen, setDrawerOpen] = React.useState(false)

    const handleOpenNavMenu = () => {
        setDrawerOpen(true)
    }

    const handleCloseNavMenu = () => {
        setDrawerOpen(false)
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
                    {pages.map((page) => (
                        <ListItem key={page.url} disablePadding>
                            <ListItemButton
                                component={Link}
                                href={page.url}
                                onClick={handleCloseNavMenu}
                            >
                                <ListItemIcon>
                                    {page.icon ? <page.icon /> : <InboxIcon />}
                                </ListItemIcon>
                                <ListItemText primary={t(page.name)} />
                            </ListItemButton>
                        </ListItem>
                    ))}
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
}

export default MobileMenu
