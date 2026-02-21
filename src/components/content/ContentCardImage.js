import Image from 'next/image'

import { Box } from '@mui/material'

import AppConfig from '@/data/AppConfig'

const ContentCardImage = ({ image, alt, aspectRatio = '16/9' }) => {
    const contentImage = image || AppConfig.DEFAULT_CARD_IMAGE
    return (
        <>
            {contentImage && (
                <Box
                    sx={{
                        aspectRatio: aspectRatio,
                        position: 'relative',
                    }}
                >
                    <Image
                        src={contentImage}
                        alt={alt}
                        fill
                        style={{
                            objectFit: 'cover',
                        }}
                    />
                </Box>
            )}
        </>
    )
}

export default ContentCardImage
