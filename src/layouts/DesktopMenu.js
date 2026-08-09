'use client'

import { Box, Button } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/layouts/LanguageSwitcher'

const DesktopMenu = ({ pages }) => {
    const t = useTranslations('Nav')

    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 2,
            }}
        >
            {pages.map((page) => (
                <Button
                    key={page.name}
                    component={Link}
                    href={page.url}
                    sx={{ color: 'white' }}
                >
                    {t(page.name)}
                </Button>
            ))}

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
}

export default DesktopMenu
