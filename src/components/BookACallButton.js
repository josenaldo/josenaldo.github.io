'use client'

import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'

import { BOOKING_URL } from '@/data/booking'
import { Link } from '@/i18n/navigation'

export default function BookACallButton({ size = 'large' }) {
    const t = useTranslations('Home.cta')

    if (BOOKING_URL) {
        return (
            <Button
                variant="contained"
                size={size}
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
            >
                {t('bookACall')}
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
            {t('bookACall')}
        </Button>
    )
}
