import { Box, Button, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import socialLinks from '@/data/socialLinks'

const GetInTouch = () => {
    const t = useTranslations('Footer')

    return (
        <Section elevation={2} py={4}>
            <Box
                color="text.secondary"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h2">{t('getInTouchTitle')}</Typography>
                <Typography
                    variant="body1"
                    textAlign="center"
                    fontStyle="italic"
                >
                    {t('getInTouchSubtitle')}
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr 1fr',
                            md: '1fr 1fr 1fr 1fr',
                        },
                        gap: 5,
                        mt: 3,
                    }}
                >
                    {socialLinks.map((link) => (
                        <Button
                            size="small"
                            variant="outlined"
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            color="secondary"
                            rel="noreferrer noopener"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                p: 2,
                            }}
                        >
                            <link.icon />
                            <span>{link.name}</span>
                        </Button>
                    ))}
                </Box>
            </Box>
        </Section>
    )
}

export default GetInTouch
