import DateIcon from '@mui/icons-material/CalendarToday'
import AuthorIcon from '@mui/icons-material/PersonOutlined'
import { Box, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'

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
                        alignItems: 'center',
                        gap: 1,
                        whiteSpace: 'nowrap',
                    }}
                >
                    <DateIcon sx={{ fontSize: '0.95rem' }} />
                    <Typography variant="caption">
                        {format(parseISO(date), 'dd/MM/yyyy')}
                    </Typography>
                </Box>
            )}

            {author && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        whiteSpace: 'nowrap',
                    }}
                >
                    <AuthorIcon sx={{ fontSize: '0.95rem' }} />
                    <Typography variant="caption">{author}</Typography>
                </Box>
            )}
        </Box>
    )
}

export default ContentMeta
