import { Box, Chip, Container, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import metrics from '@/data/metrics.mjs'

const { codebasesOwned } = metrics

const CLIENT_KEYS = ['muvz', 'conddiz', 'medicalEducationPlatform']

const ProofStrip = () => {
    const t = useTranslations('Home.proofStrip')

    return (
        <Box sx={{ bgcolor: '#101419', py: '40px' }}>
            <Container>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="overline"
                        component="p"
                        sx={{ width: '100%', textAlign: 'center' }}
                    >
                        {t('label')}
                    </Typography>

                    {CLIENT_KEYS.map((key) => (
                        <Chip
                            key={key}
                            label={t(`clients.${key}`)}
                            size="small"
                        />
                    ))}

                    <Chip
                        label={t('repoCount', {
                            count: codebasesOwned.after.count,
                        })}
                        size="small"
                        color="secondary"
                    />
                </Box>
            </Container>
        </Box>
    )
}

export default ProofStrip
