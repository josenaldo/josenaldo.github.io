// Corrige spec/03-paginas-internas.md §2: era IconButton genérico do MUI
// (First/Prev/números/Next/Last); vira quadrado 36×36 r12 âmbar na página
// atual, `rgba(255,255,255,.05)` nas outras, e `Next →` em pílula retangular.
// `justify-content: center` aqui é uma das três exceções da lei do
// alinhamento (spec/01-fundacao.md §3).

import { ChevronLeft } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

const Pagination = ({ currentPage, totalPages, onPageChange, compact }) => {
    const t = useTranslations('Common')
    if (totalPages <= 1) return null

    const handlePrev = () => onPageChange(currentPage - 1)
    const handleNext = () => onPageChange(currentPage + 1)

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
                    aria-label={t('previousPage')}
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
                    aria-label={t('nextPage')}
                    size="small"
                >
                    <ChevronLeft sx={{ transform: 'rotate(180deg)' }} />
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
                gap: '8px',
                flexWrap: 'wrap',
                mt: '32px',
            }}
        >
            {getPageNumbers().map((page, index) =>
                page === '...' ? (
                    <Typography
                        key={`ellipsis-${index}`}
                        sx={{
                            mx: '4px',
                            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                            fontSize: '13px',
                            color: '#7C8494',
                        }}
                    >
                        ...
                    </Typography>
                ) : (
                    <Box
                        key={page}
                        component="button"
                        type="button"
                        onClick={() => onPageChange(page)}
                        aria-label={t('pageNumber', { page })}
                        aria-current={page === currentPage ? 'page' : undefined}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                            fontSize: '13px',
                            fontWeight: 600,
                            color:
                                page === currentPage ? '#0B0E13' : '#C6CCD8',
                            bgcolor:
                                page === currentPage
                                    ? '#FFAA00'
                                    : 'rgba(255,255,255,.05)',
                        }}
                    >
                        {page}
                    </Box>
                )
            )}

            {currentPage < totalPages ? (
                <Box
                    component="button"
                    type="button"
                    onClick={handleNext}
                    aria-label={t('nextPage')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '36px',
                        px: '14px',
                        borderRadius: '999px',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#C6CCD8',
                        bgcolor: 'rgba(255,255,255,.05)',
                    }}
                >
                    {t('next')} →
                </Box>
            ) : null}
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
