import { Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const ContentTitle = ({
    title,
    subtitle = '',
    titleVariant = 'pageTitle',
    subtitleVariant = 'lead',
}) => {
    return (
        <Stack alignItems="center">
            <Typography variant={titleVariant} textAlign="center">
                {title}
            </Typography>
            <Typography variant={subtitleVariant} textAlign="center">
                {subtitle}
            </Typography>
        </Stack>
    )
}

ContentTitle.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    titleVariant: PropTypes.string,
    subtitleVariant: PropTypes.string,
}

export default ContentTitle
