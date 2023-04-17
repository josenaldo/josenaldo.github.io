import Image from 'next/image'
import { Box, CardMedia } from '@mui/material'
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

export default ContentMainImage
