import { Box, Divider, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

const richTextComponents = {
    strong: (chunks) => <strong>{chunks}</strong>,
}

const BlogDisclaimer = () => {
    const t = useTranslations('Blog.disclaimer')

    return (
        <Box
            component="aside"
            sx={{
                pt: 3,
            }}
        >
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {t('heading')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                {t.rich('language', richTextComponents)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                {t.rich('ai', richTextComponents)}
            </Typography>
            <Typography variant="body2">
                {t.rich('opinions', richTextComponents)}
            </Typography>
        </Box>
    )
}

export default BlogDisclaimer
