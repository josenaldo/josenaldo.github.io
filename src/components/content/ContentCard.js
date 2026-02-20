import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material'

import ContentCardImage from '@/components/content/ContentCardImage'
import ContentMeta from '@/components/content/ContentMeta'
import ContentCategory from '@/components/content/ContentCategory'
import ShareLink from '@/components/share/ShareLink'

const ContentCard = ({
  icon: Icon,
  title,
  text,
  url,
  image,
  moreLinkText = 'More',
  date,
  author,
  category,
  showText = false,
  showMeta = true,
  showActions = true,
  showShare = true,
}) => {
  const hasImage = Boolean(image)
  const hasMeta = Boolean(date || author)

  return (
    <Card
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'background.paper',
      }}
    >
      {hasImage && (
        <CardMedia
          sx={{
            position: 'relative',
          }}
        >
          <ContentCardImage image={image} alt={title} />
          {category && (
            <Box
              sx={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
              }}
            >
              <ContentCategory category={category} />
            </Box>
          )}
        </CardMedia>
      )}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 1,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {Icon && <Icon color="secondary" />}
            <Typography component="h3" variant="h6">
              {title}
            </Typography>
          </Box>

          {showText && text && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {text}
            </Typography>
          )}
        </Box>

        {showMeta && hasMeta && <ContentMeta date={date} author={author} category={category} />}
      </CardContent>

      {showActions && (url || (showShare && url)) && (
        <CardActions
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignSelf: 'flex-end',
          }}
        >
          {url ? (
            <Button component="a" href={url} aria-label={title ? `Open ${title}` : moreLinkText}>
              {moreLinkText}
            </Button>
          ) : (
            <Box />
          )}
          {showShare && url && (
            <ShareLink
              title={title}
              description={text}
              url={url}
              image={image ? `${image}` : undefined}
            />
          )}
        </CardActions>
      )}
    </Card>
  )
}

export default ContentCard
