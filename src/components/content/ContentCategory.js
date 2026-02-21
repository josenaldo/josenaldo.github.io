import { Chip } from '@mui/material'

const ContentCategory = ({ category, color = 'secondary' }) => {
    if (!category) return null

    const categorySlug = encodeURIComponent(String(category).trim())
    const label = String(category).trim().toUpperCase()

    return (
        <Chip
            size="small"
            color={color}
            label={label}
            component="a"
            clickable
            href={`/blog/category/${categorySlug}`}
            sx={{
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
            }}
        />
    )
}

export default ContentCategory
