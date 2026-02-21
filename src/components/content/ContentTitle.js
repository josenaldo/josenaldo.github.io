import { Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const ContentTitle = ({
    title,
    subtitle = '',
    titleVariant = 'h1',
    subtitleVariant = 'subtitle',
}) => {
    return (
        <Stack alignItems="center">
            <Typography variant={titleVariant} textAlign="center">
                {title}
            </Typography>
            <Typography
                variant={subtitleVariant}
                textAlign="center"
                color="secondary.light"
                fontStyle="italic"
            >
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
