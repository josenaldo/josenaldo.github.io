import {
    ChevronLeft,
    ChevronRight,
    FirstPage,
    LastPage,
} from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const Pagination = ({ currentPage, totalPages, onPageChange, compact }) => {
    if (totalPages <= 1) return null

    const handleFirst = () => onPageChange(1)
    const handlePrev = () => onPageChange(currentPage - 1)
    const handleNext = () => onPageChange(currentPage + 1)
    const handleLast = () => onPageChange(totalPages)

    if (compact) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                }}
            >
                <IconButton
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    size="small"
                >
                    <ChevronLeft />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 1 }}>
                    {currentPage} / {totalPages}
                </Typography>
                <IconButton
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    size="small"
                >
                    <ChevronRight />
                </IconButton>
            </Box>
        )
    }

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let end = Math.min(totalPages, start + maxVisible - 1)

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1)
        }

        if (start > 1) {
            pages.push(1)
            if (start > 2) pages.push('...')
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...')
            pages.push(totalPages)
        }

        return pages
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 0.5, sm: 1 },
                flexWrap: 'wrap',
            }}
        >
            <IconButton
                onClick={handleFirst}
                disabled={currentPage === 1}
                aria-label="First page"
                size="small"
            >
                <FirstPage />
            </IconButton>
            <IconButton
                onClick={handlePrev}
                disabled={currentPage === 1}
                aria-label="Previous page"
                size="small"
            >
                <ChevronLeft />
            </IconButton>

            {getPageNumbers().map((page, index) =>
                page === '...' ? (
                    <Typography
                        key={`ellipsis-${index}`}
                        variant="body2"
                        sx={{ mx: 0.5, color: 'text.secondary' }}
                    >
                        ...
                    </Typography>
                ) : (
                    <IconButton
                        key={page}
                        onClick={() => onPageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                        size="small"
                        sx={{
                            minWidth: 36,
                            height: 36,
                            borderRadius: 1,
                            color:
                                page === currentPage
                                    ? 'primary.contrastText'
                                    : 'text.primary',
                            bgcolor:
                                page === currentPage
                                    ? 'primary.main'
                                    : 'transparent',
                            '&:hover': {
                                bgcolor:
                                    page === currentPage
                                        ? 'primary.dark'
                                        : 'action.hover',
                            },
                        }}
                    >
                        <Typography variant="body2">{page}</Typography>
                    </IconButton>
                )
            )}

            <IconButton
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                size="small"
            >
                <ChevronRight />
            </IconButton>
            <IconButton
                onClick={handleLast}
                disabled={currentPage === totalPages}
                aria-label="Last page"
                size="small"
            >
                <LastPage />
            </IconButton>
        </Box>
    )
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    compact: PropTypes.bool,
}

export default Pagination
