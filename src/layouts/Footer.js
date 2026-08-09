import { Box, Container, Paper } from '@mui/material'
import { useTranslations } from 'next-intl'

import { SITE_LAUNCH_YEAR } from '@/data/metrics.mjs'

const Footer = () => {
    const t = useTranslations('Footer')
    const currentYear = new Date().getFullYear()

    return (
        <Box
            component="footer"
            sx={{
                display: 'flex',
                width: '100%',
            }}
        >
            <Paper
                elevation={1}
                sx={{
                    width: '100%',
                    py: 2,
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                mt: 3,
                                fontSize: '0.7rem',
                                textAlign: 'center',
                            }}
                        >
                            {t('copyright', {
                                startYear: SITE_LAUNCH_YEAR,
                                currentYear,
                            })}
                        </Box>
                    </Box>
                </Container>
            </Paper>
        </Box>
    )
}

export default Footer
