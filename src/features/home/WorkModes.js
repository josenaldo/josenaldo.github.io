import { Box, Card, CardContent, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import Section from '@/components/Section'

const WorkModes = ({ workModes }) => {
    const t = useTranslations('Home.workModes')
    const visibleWorkModes = Array.isArray(workModes) ? workModes : []

    return (
        <Section surface="band" rhythm="hero">
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

                {visibleWorkModes.length === 0 ? (
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
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: 4,
                        }}
                    >
                        {visibleWorkModes.map((mode) => {
                            const bullets = Array.isArray(mode.bullets)
                                ? mode.bullets
                                : []

                            return (
                                <Card
                                    key={mode.name}
                                    elevation={2}
                                    sx={{
                                        bgcolor: 'background.paper',
                                        height: '100%',
                                        borderRadius: '16px',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            pt: 4,
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            component="h3"
                                            sx={{
                                                fontSize: '1.625rem',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {mode.name}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                        >
                                            {mode.promise}
                                        </Typography>

                                        <Box
                                            component="ul"
                                            sx={{
                                                textAlign: 'left',
                                                width: '100%',
                                                m: 0,
                                                p: 0,
                                                listStyle: 'none',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            {bullets.map((bullet) => (
                                                <Box
                                                    key={bullet}
                                                    component="li"
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1.5,
                                                        alignItems:
                                                            'flex-start',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 6,
                                                            height: 6,
                                                            mt: '0.55em',
                                                            flexShrink: 0,
                                                            borderRadius: '50%',
                                                            bgcolor:
                                                                'primary.main',
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {bullet}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Box>
                )}
            </Box>
        </Section>
    )
}

WorkModes.propTypes = {
    workModes: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            promise: PropTypes.string,
            bullets: PropTypes.arrayOf(PropTypes.string),
            icon: PropTypes.string,
        })
    ),
}

export default WorkModes
