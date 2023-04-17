import React from 'react'

import { useRouter } from 'next/router'

import {
  Box,
  Card,
  CardMedia,
  Divider,
  Backdrop,
  CircularProgress,
  CardContent,
} from '@mui/material'

import ContentMainImage from '@/components/content/ContentMainImage'
import ContentTitle from '@/components/content/ContentTitle'
import ContentMeta from '@/components/content/ContentMeta'
import ContentCategory from '@/components/content/ContentCategory'

import MDXContent from '@/components/content/MDXContent'

import ShareLink from '@/components/share/ShareLink'

const ContentView = ({
  content,
  title,
  description,
  image,
  url,
  date,
  author,
  category,
}) => {
  return (
    <Card
      sx={{
        my: 5,
      }}
    >
      <CardMedia>
        <ContentMainImage image={image} alt={title} />
      </CardMedia>
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: `"1fr 1fr"
              "1fr"`,
              sm: '1fr 1fr 1fr',
            },
            gridTemplateAreas: {
              xs: `"category share"
              "meta meta"`,
              sm: '"category meta share"',
            },
          }}
        >
          <Box
            sx={{
              gridArea: 'category',
              justifySelf: 'left',
              alignSelf: 'center',
            }}
          >
            <ContentCategory category={category} />
          </Box>
          <Box
            sx={{
              gridArea: 'meta',
              justifySelf: 'center',
              alignSelf: 'center',
            }}
          >
            <ContentMeta date={date} author={author} />
          </Box>

          <Box
            sx={{
              gridArea: 'share',
              justifySelf: 'right',
              alignSelf: 'center',
            }}
          >
            <ShareLink
              showText
              title={title}
              description={description}
              url={url}
              image={`${process.env.NEXT_PUBLIC_SITE_URL}${image}`}
            />
          </Box>
        </Box>

        <ContentTitle title={title} subtitle={description} titleVariant="h2" />

        <Box
          sx={{
            display: 'flex',
            color: 'text.secondary',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <MDXContent content={content} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default ContentView
