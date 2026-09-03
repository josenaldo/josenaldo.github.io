'use client'

import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'

import { BOOKING_URL } from '@/data/booking'
import { Link } from '@/i18n/navigation'

export default function BookACallButton({
    size = 'large',
    short = false,
    fullWidth = false,
    sx,
}) {
    const t = useTranslations('Home.cta')
    const label = t(short ? 'bookACallShort' : 'bookACall')

    // `nowrap` só a partir de sm: era assim que o botão do header virava uma
    // coluna de uma palavra por linha quando a fila não cabia. No xs ele fica
    // de fora de propósito — o rótulo longo do Hero/contato precisa poder
    // quebrar, e `maxWidth: 100%` impede que ele vaze do container.
    const buttonSx = {
        whiteSpace: { xs: 'normal', sm: 'nowrap' },
        maxWidth: '100%',
        ...sx,
    }

    if (BOOKING_URL) {
        return (
            <Button
                variant="contained"
                size={size}
                fullWidth={fullWidth}
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={buttonSx}
            >
                {label}
            </Button>
        )
    }

    return (
        <Button
            variant="contained"
            size={size}
            fullWidth={fullWidth}
            component={Link}
            href="/contact"
            sx={buttonSx}
        >
            {label}
        </Button>
    )
}
