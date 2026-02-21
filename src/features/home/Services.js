import CodeIcon from '@mui/icons-material/Code'
import DeviceHubIcon from '@mui/icons-material/DeviceHub'
import PsychologyIcon from '@mui/icons-material/Psychology'
import SchoolIcon from '@mui/icons-material/School'
import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

import CallToAction from '@/components/CallToAction'
import IconCard from '@/components/content/IconCard'
import Section from '@/components/Section'

const iconMap = {
    code: CodeIcon,
    api: DeviceHubIcon,
    architecture: PsychologyIcon,
    mentoring: SchoolIcon,
}

const Services = ({ services }) => {
    const visibleServices = Array.isArray(services) ? services : []

    return (
        <Section elevation={1}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 5,
                }}
            >
                <Typography variant="h2">Services</Typography>

                {visibleServices.length === 0 ? (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        textAlign="center"
                    >
                        Em breve, mais detalhes sobre os serviços.
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
                        {visibleServices.map((service) => {
                            const Icon = iconMap[service.icon] ?? CodeIcon

                            return (
                                <IconCard
                                    key={service.title}
                                    icon={Icon}
                                    service={service}
                                />
                            )
                        })}
                    </Box>
                )}

                <CallToAction href="/contact">Let’s talk</CallToAction>
            </Box>
        </Section>
    )
}

Services.propTypes = {
    services: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            icon: PropTypes.string,
        })
    ),
}

export default Services
