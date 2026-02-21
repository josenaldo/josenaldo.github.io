import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material'
import PropTypes from 'prop-types'

import ContentCardImage from '@/components/content/ContentCardImage'
import ContentCategory from '@/components/content/ContentCategory'
import ContentMeta from '@/components/content/ContentMeta'
import ShareLink from '@/components/share/ShareLink'

const ContentCard = ({
    icon: Icon,
    title,
    text,
    url,
    image,
    moreLinkText = 'Details',
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

    const titleLineClamp = 2
    const descriptionLineClamp = 3

    const lineClampSx = (lines) => ({
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
        overflow: 'hidden',
    })

    return (
        <Card
            elevation={2}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: 'background.paper',
                transition: (theme) =>
                    theme.transitions.create(['transform', 'box-shadow'], {
                        duration: theme.transitions.duration.short,
                    }),
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 6,
                },
            }}
        >
            {hasImage && (
                <CardMedia
                    sx={{
                        position: 'relative',
                        lineHeight: 0,
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
                    pt: hasImage ? 2 : 2.5,
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                        }}
                    >
                        {Icon && <Icon color="secondary" />}
                        <Typography
                            component="h3"
                            variant="h6"
                            sx={{
                                ...lineClampSx(titleLineClamp),
                                minHeight: '3.2em',
                                flexGrow: 1,
                            }}
                        >
                            {title}
                        </Typography>

                        {!hasImage && category && (
                            <Box sx={{ pt: 0.25 }}>
                                <ContentCategory category={category} />
                            </Box>
                        )}
                    </Box>

                    {showText && text && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 1,
                                ...lineClampSx(descriptionLineClamp),
                                minHeight: '4.3em',
                            }}
                        >
                            {text}
                        </Typography>
                    )}
                </Box>

                {showMeta && hasMeta && (
                    <ContentMeta
                        date={date}
                        author={author}
                        category={category}
                    />
                )}
            </CardContent>

            {showActions && (url || (showShare && url)) && (
                <CardActions
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        px: 2,
                        pb: 2,
                        pt: 1,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    {url ? (
                        <Button
                            component="a"
                            href={url}
                            aria-label={title ? `Open ${title}` : moreLinkText}
                        >
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

ContentCard.propTypes = {
    icon: PropTypes.elementType,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    url: PropTypes.string,
    image: PropTypes.string,
    moreLinkText: PropTypes.string,
    date: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
    showText: PropTypes.bool,
    showMeta: PropTypes.bool,
    showActions: PropTypes.bool,
    showShare: PropTypes.bool,
}

export default ContentCard
