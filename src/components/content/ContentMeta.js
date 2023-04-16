import { Box, Chip, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'

import AuthorIcon from '@mui/icons-material/PersonOutlined'
import DateIcon from '@mui/icons-material/CalendarToday'

const ContentMeta = ({ date, author, color = 'text.secondary' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        pt: 1,
        color: color,
      }}
    >
      {date && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <DateIcon fontSize="0.75rem" />
          <Typography variant="caption">
            {format(parseISO(date), 'dd/MM/yyyy')}
          </Typography>
        </Box>
      )}

      {author && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <AuthorIcon fontSize="0.75rem" />
          <Typography variant="caption">{author}</Typography>
        </Box>
      )}
    </Box>
  )
}

export default ContentMeta
