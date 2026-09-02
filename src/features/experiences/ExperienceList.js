// Corrige spec/03-paginas-internas.md §5: era MUI Accordion (caixa cinza
// default, "Mui-expanded" etc — a spec pede explicitamente para tirar essa
// caixa). Vira um <button> simples + estado local; só uma linha expandida
// por vez, a primeira (mais recente) começa aberta.

'use client'

import { useState } from 'react'

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import MDXContent from '@/components/content/MDXContent'

const LABEL_SX = {
    m: 0,
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    color: '#7C8494',
}

const BODY_SX = {
    fontSize: '15px',
    lineHeight: 1.65,
    color: '#B4BCCA',
    '& > *': { m: 0 },
    '& ul': { pl: '18px', m: 0, display: 'flex', flexDirection: 'column', gap: '8px' },
}

const ExperienceRow = ({ experience, expanded, onToggle }) => {
    const t = useTranslations('Experiences')

    return (
        <Box
            sx={{
                bgcolor: '#14181F',
                borderRadius: '16px',
                p: expanded ? '24px' : '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: expanded ? '20px' : '10px',
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '150px 1fr auto' },
                    gap: '24px',
                    alignItems: 'center',
                }}
            >
                <Typography
                    component="span"
                    sx={{
                        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                        fontSize: '12px',
                        color: expanded ? '#FFAA00' : '#7C8494',
                    }}
                >
                    {experience.period}
                </Typography>

                <Box>
                    <Typography
                        component="p"
                        sx={{ m: 0, fontSize: '20px', fontWeight: 600, color: '#FFFFFF' }}
                    >
                        {experience.title}
                    </Typography>
                    <Typography
                        component="p"
                        sx={{ m: 0, fontSize: '14px', color: '#98A0B0' }}
                    >
                        {`${experience.company} · ${experience.location}`}
                    </Typography>
                </Box>

                <Box
                    component="button"
                    type="button"
                    onClick={onToggle}
                    aria-expanded={expanded}
                    sx={{
                        justifySelf: { xs: 'flex-start', sm: 'flex-end' },
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '10px',
                        px: '12px',
                        py: '6px',
                        color: expanded ? '#C6CCD8' : '#B69BF0',
                        bgcolor: expanded
                            ? 'rgba(255,255,255,.05)'
                            : 'rgba(136,85,223,.12)',
                    }}
                >
                    {expanded ? t('collapse') : t('expand')}
                </Box>
            </Box>

            {expanded ? (
                <>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                            gap: '24px',
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Typography component="p" sx={LABEL_SX}>
                                {t('challenge')}
                            </Typography>
                            <Box sx={BODY_SX}>
                                <MDXContent content={experience.sections.challenge} />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Typography component="p" sx={LABEL_SX}>
                                {t('action')}
                            </Typography>
                            <Box sx={BODY_SX}>
                                <MDXContent content={experience.sections.action} />
                            </Box>
                        </Box>
                    </Box>

                    {experience.sections.result ? (
                        <Box
                            sx={{
                                bgcolor: '#191233',
                                borderRadius: '14px',
                                p: '20px 24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                            }}
                        >
                            <Typography
                                component="p"
                                sx={{
                                    ...LABEL_SX,
                                    color: '#B69BF0',
                                }}
                            >
                                {t('result')}
                            </Typography>
                            <Box sx={{ ...BODY_SX, color: '#E5DEF7', fontSize: '15px' }}>
                                <MDXContent content={experience.sections.result} />
                            </Box>
                        </Box>
                    ) : null}
                </>
            ) : null}
        </Box>
    )
}

ExperienceRow.propTypes = {
    experience: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        period: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        sections: PropTypes.shape({
            challenge: PropTypes.string,
            action: PropTypes.string,
            result: PropTypes.string,
        }).isRequired,
    }).isRequired,
    expanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
}

const ExperienceList = ({ experiences }) => {
    const [openId, setOpenId] = useState(experiences[0]?.id ?? null)

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {experiences.map((experience) => (
                <ExperienceRow
                    key={experience.id}
                    experience={experience}
                    expanded={openId === experience.id}
                    onToggle={() =>
                        setOpenId(openId === experience.id ? null : experience.id)
                    }
                />
            ))}
        </Box>
    )
}

ExperienceList.propTypes = {
    experiences: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default ExperienceList
