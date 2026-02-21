import React from 'react'

import { Box, Card, CardContent, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const getText = ({ title, text, service }) => {
    const resolvedTitle = title ?? service?.title
    const resolvedText = text ?? service?.description

    return {
        title: resolvedTitle,
        text: resolvedText,
    }
}

const renderIcon = (Icon) => {
    if (!Icon) return null

    if (React.isValidElement(Icon)) {
        return React.cloneElement(Icon, {
            sx: {
                fontSize: 120,
                color: 'common.white',
                ...(Icon.props?.sx ?? {}),
            },
            'aria-hidden': true,
        })
    }

    return (
        <Icon
            aria-hidden
            sx={{
                fontSize: 120,
                color: 'common.white',
            }}
        />
    )
}

const IconCard = ({ icon, title, text, service, elevation = 2 }) => {
    const resolved = getText({ title, text, service })

    return (
        <Card
            elevation={elevation}
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
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.main',
                    }}
                >
                    {renderIcon(icon)}
                </Box>

                <Typography variant="h5" component="h3">
                    {resolved.title}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    {resolved.text}
                </Typography>
            </CardContent>
        </Card>
    )
}

IconCard.propTypes = {
    icon: PropTypes.elementType,
    title: PropTypes.string,
    text: PropTypes.string,
    service: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
    }),
    elevation: PropTypes.number,
}

export default IconCard
