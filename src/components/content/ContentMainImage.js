import Image from 'next/image'

import { Box } from '@mui/material'
import PropTypes from 'prop-types'

import AppConfig from '@/data/AppConfig'

const ContentMainImage = ({ image, alt, aspectRatio = '16/9' }) => {
    const contentImage = image || AppConfig.DEFAULT_CARD_IMAGE

    if (!contentImage) return null

    return (
        <Box
            sx={{
                aspectRatio: aspectRatio,
                position: 'relative',
            }}
        >
            <Image
                src={contentImage}
                alt={alt}
                priority
                fill
                style={{
                    objectFit: 'cover',
                }}
            />
        </Box>
    )
}

ContentMainImage.propTypes = {
    image: PropTypes.string,
    alt: PropTypes.string.isRequired,
    aspectRatio: PropTypes.string,
}

export default ContentMainImage
