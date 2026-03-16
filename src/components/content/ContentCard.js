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
import ContentLanguage from '@/components/content/ContentLanguage'
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
    language,
    showText = false,
    showMeta = true,
    showActions = true,
    showShare = true,
}) => {
    const hasImage = Boolean(image)
    const hasMeta = Boolean(date || author)

    const titleLineClamp = 2
    const descriptionLineClamp = 3
    const hasBadges = Boolean(category || language)

    const lineClampSx = (lines) => ({
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
        overflow: 'hidden',
    })

    const badges = hasBadges ? (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'flex-end',
            }}
        >
            {category && <ContentCategory category={category} />}
            <ContentLanguage language={language} />
        </Box>
    ) : null

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
                    {badges && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                maxWidth: 'calc(100% - 2rem)',
                            }}
                        >
                            {badges}
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
                    {!hasImage && badges && <Box sx={{ mb: 1 }}>{badges}</Box>}

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
    language: PropTypes.string,
    showText: PropTypes.bool,
    showMeta: PropTypes.bool,
    showActions: PropTypes.bool,
    showShare: PropTypes.bool,
}

export default ContentCard
