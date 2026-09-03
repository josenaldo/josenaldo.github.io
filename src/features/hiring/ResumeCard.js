// Corrige a antiga ResumeDownloads.js: era uma Section inteira, abaixo do
// conteúdo. Vira o card de currículo do header (spec/03-paginas-internas.md
// §1, Bloco 1) — a única coisa que fica à direita do h1.

import { Box, Button, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import { RESUMES } from '@/data/resumes.mjs'

const ResumeCard = () => {
    const t = useTranslations('Hiring.resumes')

    const senior = RESUMES.filter((resume) => resume.variant === 'senior')
    const fractional = RESUMES.filter(
        (resume) => resume.variant === 'fractional'
    )

    const labels = {
        'senior-en': t('seniorEn'),
        'senior-pt': t('seniorPt'),
        'fractional-en': t('fractionalEn'),
        'fractional-pt': t('fractionalPt'),
    }

    return (
        <Box
            sx={{
                bgcolor: '#14181F',
                borderRadius: '18px',
                p: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow:
                    '0 1px 2px rgba(0,0,0,.4), 0 18px 40px -28px rgba(0,0,0,1)',
            }}
        >
            <Typography
                component="p"
                sx={{
                    m: 0,
                    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#98A0B0',
                }}
            >
                {t('title')}
            </Typography>

            {/* Um roxo cheio e três neutros: o card tem UMA ação primária.
            Com os quatro em `outlined` roxo, nada dizia qual era. */}
            {senior.map((resume, index) => (
                <Button
                    key={resume.id}
                    variant={index === 0 ? 'contained' : 'text'}
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    sx={
                        index === 0
                            ? undefined
                            : {
                                  color: '#C6CCD8',
                                  bgcolor: 'rgba(255,255,255,.05)',
                                  '&:hover': {
                                      bgcolor: 'rgba(255,255,255,.09)',
                                  },
                              }
                    }
                >
                    {labels[resume.id]}
                </Button>
            ))}

            <Box sx={{ borderTop: '1px solid rgba(255,255,255,.07)' }} />

            <Typography
                component="p"
                sx={{
                    m: 0,
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#98A0B0',
                }}
            >
                {t('fractionalNote')}
            </Typography>

            <Box sx={{ display: 'flex', gap: '10px' }}>
                {fractional.map((resume) => (
                    <Button
                        key={resume.id}
                        variant="text"
                        href={resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            flex: 1,
                            fontSize: '13px',
                            p: '10px 12px',
                            color: '#C6CCD8',
                            bgcolor: 'rgba(255,255,255,.05)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,.09)' },
                        }}
                    >
                        {labels[resume.id]}
                    </Button>
                ))}
            </Box>
        </Box>
    )
}

export default ResumeCard
