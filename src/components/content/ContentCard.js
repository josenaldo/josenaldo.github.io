import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
} from '@mui/material'

import ContentCardImage from '@/components/content/ContentCardImage'
import ShareLink from '@/components/share/ShareLink'

const ContentCard = ({ title, text, url, image, moreLinkText = 'More' }) => {
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
      </CardMedia>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flexGrow: 1,
        }}
      >
        <Typography component="h3" variant="h4" color="primary">
          {title}
        </Typography>
        <Typography component="p" variant="body2" color="text.primary">
          {text}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignSelf: 'flex-end',
          p: 2,
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
