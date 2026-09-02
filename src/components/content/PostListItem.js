import { Box, Button, Stack, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import ContentCardImage from '@/components/content/ContentCardImage'
import ContentCategory from '@/components/content/ContentCategory'
import ContentMeta from '@/components/content/ContentMeta'

const PostListItem = ({
    title,
    text,
    url,
    image,
    moreLinkText,
    date,
    author,
    category,
}) => {
    const t = useTranslations('Common')
    const resolvedMoreLinkText = moreLinkText ?? t('details')

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                py: 3,
            }}
        >
            <Box sx={{ width: { xs: '100%', md: 200 }, flexShrink: 0 }}>
                <ContentCardImage image={image} alt={title} />
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                {category && (
                    <Box>
                        <ContentCategory category={category} />
                    </Box>
                )}
                <Typography component="h3" variant="h6">
                    {title}
                </Typography>
                {text && (
                    <Typography variant="body2" color="text.secondary">
                        {text}
                    </Typography>
                )}
            </Box>

            <Stack
                sx={{
                    flexShrink: 0,
                    alignItems: { xs: 'flex-start', md: 'flex-end' },
                    justifyContent: 'space-between',
                    minWidth: { md: 140 },
                }}
            >
                <ContentMeta date={date} author={author} />
                {url && (
                    <Button
                        component="a"
                        href={url}
                        variant="text"
                        aria-label={
                            title
                                ? t('openItem', {
                                      label: resolvedMoreLinkText,
                                      title,
                                  })
                                : resolvedMoreLinkText
                        }
                    >
                        {resolvedMoreLinkText} →
                    </Button>
                )}
            </Stack>
        </Box>
    )
}

PostListItem.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    url: PropTypes.string,
    image: PropTypes.string,
    moreLinkText: PropTypes.string,
    date: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
}

export default PostListItem
