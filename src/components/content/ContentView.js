import { Box, Card, CardContent, CardMedia } from '@mui/material'
import PropTypes from 'prop-types'

import BlogDisclaimer from '@/components/content/BlogDisclaimer'
import ContentCategory from '@/components/content/ContentCategory'
import ContentLanguage from '@/components/content/ContentLanguage'
import ContentMainImage from '@/components/content/ContentMainImage'
import ContentMeta from '@/components/content/ContentMeta'
import ContentTitle from '@/components/content/ContentTitle'
import MDXContent from '@/components/content/MDXContent'
import ShareLink from '@/components/share/ShareLink'
import AppConfig from '@/data/AppConfig'

const ContentView = ({
    content,
    title,
    description,
    image,
    url,
    date,
    author,
    category,
    language,
}) => {
    const contentImage = image || AppConfig.DEFAULT_CARD_IMAGE
    const badges = category || language ? (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
            }}
        >
            {category && <ContentCategory category={category} />}
            <ContentLanguage language={language} />
        </Box>
    ) : null

    return (
        <Card
            sx={{
                my: 5,
            }}
        >
            {image && (
                <CardMedia>
                    <ContentMainImage image={image} alt={title} />
                </CardMedia>
            )}
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
                        {badges}
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
                            image={`${process.env.NEXT_PUBLIC_SITE_URL}${contentImage}`}
                        />
                    </Box>
                </Box>

                <ContentTitle
                    title={title}
                    subtitle={description}
                    titleVariant="h2"
                />

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

                <BlogDisclaimer />
            </CardContent>
        </Card>
    )
}

ContentView.propTypes = {
    content: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string.isRequired,
    date: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
    language: PropTypes.string,
}

export default ContentView
