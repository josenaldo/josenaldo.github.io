import React from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
} from '@mui/material'
import PropTypes from 'prop-types'

const MobileMenu = ({ pages }) => {
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
                aria-label="site menu"
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
                            <ListItemButton href={page.url}>
                                <ListItemIcon>
                                    {page.icon ? <page.icon /> : <InboxIcon />}
                                </ListItemIcon>
                                <ListItemText primary={page.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
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
