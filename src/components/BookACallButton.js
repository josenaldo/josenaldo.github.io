'use client'

import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'

import { BOOKING_URL } from '@/data/booking'
import { Link } from '@/i18n/navigation'

export default function BookACallButton({ size = 'large', short = false }) {
    const t = useTranslations('Home.cta')
    const label = t(short ? 'bookACallShort' : 'bookACall')

    if (BOOKING_URL) {
        return (
            <Button
                variant="contained"
                size={size}
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
            >
                {label}
            </Button>
        )
    }

    return (
        <Button
            variant="contained"
            size={size}
            component={Link}
            href="/contact"
        >
            {label}
        </Button>
    )
}
