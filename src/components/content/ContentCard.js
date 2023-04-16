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
  title,
  text,
  url,
  image,
  moreLinkText = 'Read more',
  date,
  author,
  category,
}) => {
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
      <CardMedia
        sx={{
          position: 'relative',
        }}
      >
        <ContentCardImage image={image} alt={title} />
        <Box
          sx={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
          }}
        >
          <ContentCategory category={category} />
        </Box>
      </CardMedia>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Typography component="h3" variant="h6">
            {title}
          </Typography>
        </Box>

        <ContentMeta date={date} author={author} category={category} />
      </CardContent>

      <CardActions
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignSelf: 'flex-end',
        }}
      >
        <Button component="a" href={url}>
          {moreLinkText}
        </Button>
        <ShareLink
          title={title}
          description={text}
          url={url}
          image={`${image}`}
        />
      </CardActions>
    </Card>
  )
}

export default ContentCard
