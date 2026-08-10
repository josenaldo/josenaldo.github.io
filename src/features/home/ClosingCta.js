import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import BookACallButton from '@/components/BookACallButton'
import Section from '@/components/Section'

const ClosingCta = () => {
    const t = useTranslations('Home.closingCta')

    return (
        <Section elevation={0}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    maxWidth: 'md',
                    mx: 'auto',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h2">{t('title')}</Typography>

                <Typography variant="body1" color="text.secondary">
                    {t('body')}
                </Typography>

                <BookACallButton />
            </Box>
        </Section>
    )
}

export default ClosingCta
