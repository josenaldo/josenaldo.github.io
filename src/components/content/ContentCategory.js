import { Chip, Button } from '@mui/material'

const ContentCategory = ({ category, color = 'secondary' }) => {
  if (!category) return null

  return (
    <Button
      size="small"
      // variant="contained"
      color={color}
      href={`/blog/category/${category}`}
    >
      {category}
    </Button>
  )
}

export default ContentCategory
