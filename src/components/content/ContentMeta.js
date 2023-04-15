import { Box, Chip } from '@mui/material'
import { format, parseISO } from 'date-fns'

const ContentMeta = ({
  date,
  author,
  color = 'text.secondary',
  backgroundColor = '',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      {date && (
        <Chip
          size="small"
          label={format(parseISO(date), 'dd/MM/yyyy')}
          sx={{
            color: color,
            backgroundColor: backgroundColor,
          }}
        />
      )}

      {author && (
        <Chip
          size="small"
          label={author}
          sx={{
            color: color,
            backgroundColor: backgroundColor,
          }}
        />
      )}
    </Box>
  )
}

export default ContentMeta
