import CodeIcon from '@mui/icons-material/Code'
import DeviceHubIcon from '@mui/icons-material/DeviceHub'
import PsychologyIcon from '@mui/icons-material/Psychology'
import SchoolIcon from '@mui/icons-material/School'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import Section from '@/components/Section'

const iconMap = {
    code: CodeIcon,
    api: DeviceHubIcon,
    architecture: PsychologyIcon,
    mentoring: SchoolIcon,
}

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
                            const Icon = iconMap[mode.icon] ?? CodeIcon
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
                                        borderRadius: 4,
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
                                        <Box
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'primary.main',
                                            }}
                                        >
                                            <Icon
                                                aria-hidden
                                                sx={{
                                                    fontSize: 72,
                                                    color: 'common.white',
                                                }}
                                            />
                                        </Box>

                                        <Typography variant="h5" component="h3">
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
                                                pl: 3,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            {bullets.map((bullet) => (
                                                <Typography
                                                    key={bullet}
                                                    component="li"
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {bullet}
                                                </Typography>
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
