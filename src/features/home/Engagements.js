import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import Section from '@/components/Section'

const Engagements = ({ engagements }) => {
    const t = useTranslations('Home.engagements')
    const visibleEngagements = Array.isArray(engagements) ? engagements : []

    return (
        <Section surface="default" rhythm="hero">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 5,
                }}
            >
                <Typography variant="h2">{t('title')}</Typography>

                {visibleEngagements.length === 0 ? (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        textAlign="center"
                    >
                        {t('emptyState')}
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        {visibleEngagements.map((engagement) => (
                            <Card
                                key={engagement.title}
                                elevation={2}
                                sx={{
                                    bgcolor: 'background.paper',
                                    borderRadius: 4,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        p: 4,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h5" component="h3">
                                            {engagement.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {engagement.role} ·{' '}
                                            {engagement.period}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Box>
                                        <Typography
                                            variant="overline"
                                            color="text.secondary"
                                        >
                                            {t('arrived')}
                                        </Typography>
                                        <Typography variant="body1">
                                            {engagement.arrived}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography
                                            variant="overline"
                                            color="text.secondary"
                                        >
                                            {t('built')}
                                        </Typography>
                                        <Typography variant="body1">
                                            {engagement.built}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            borderRadius: 2,
                                            p: 3,
                                            mt: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="overline"
                                            sx={{
                                                color: 'inherit',
                                            }}
                                        >
                                            {t('result')}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'inherit',
                                            }}
                                        >
                                            {engagement.result}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>
        </Section>
    )
}

Engagements.propTypes = {
    engagements: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            role: PropTypes.string,
            period: PropTypes.string,
            arrived: PropTypes.string,
            built: PropTypes.string,
            result: PropTypes.string,
        })
    ),
}

export default Engagements
