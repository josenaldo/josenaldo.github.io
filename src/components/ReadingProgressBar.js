'use client'

import { useEffect, useState } from 'react'

import { Box } from '@mui/material'

import { usePathname } from '@/i18n/navigation'

const POST_PATH = /^\/blog\/(?!category(?:\/|$))[^/]+$/

export default function ReadingProgressBar() {
    const pathname = usePathname()
    const [progress, setProgress] = useState(0)

    const isPostPage = POST_PATH.test(pathname)

    useEffect(() => {
        if (!isPostPage) return undefined

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } =
                document.documentElement
            const scrollable = scrollHeight - clientHeight

            setProgress(scrollable > 0 ? (scrollTop / scrollable) * 100 : 0)
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => window.removeEventListener('scroll', handleScroll)
    }, [isPostPage])

    if (!isPostPage) return null

    return (
        <Box
            role="progressbar"
            aria-label="reading progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            sx={{
                height: '2px',
                width: `${progress}%`,
                bgcolor: 'secondary.main',
                transition: 'width 120ms linear',
            }}
        />
    )
}
