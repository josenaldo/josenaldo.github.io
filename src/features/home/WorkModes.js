// Corrige D-07: cabeçalho numerado `01`, cards alinhados à esquerda, pílula
// de kicker, h3 26px, gap 20px.
//
// `mode.kicker` é um campo NOVO no frontmatter de content/workModes/*.md
// (ver spec/05-i18n.md §3). Se ausente, a pílula não renderiza — a página
// continua correta, só menos informativa.

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import Pill from '@/components/Pill'
import Section from '@/components/Section'
import SectionHeader from '@/components/SectionHeader'

const WorkModes = ({ workModes }) => {
    const t = useTranslations('Home.workModes')
    const visibleWorkModes = Array.isArray(workModes) ? workModes : []

    return (
        <Section surface="band" padTop={76} padBottom={76} id="work-modes">
            <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}
            >
                <SectionHeader n="01" title={t('title')} />

                {visibleWorkModes.length === 0 ? (
                    <Typography sx={{ color: '#98A0B0' }}>
                        {t('emptyState')}
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                lg: 'repeat(3, 1fr)',
                            },
                            gap: '20px',
                        }}
                    >
                        {visibleWorkModes.map((mode) => {
                            const bullets = Array.isArray(mode.bullets)
                                ? mode.bullets
                                : []

                            return (
                                <Box
                                    key={mode.name}
                                    sx={{
                                        bgcolor: '#14181F',
                                        borderRadius: '18px',
                                        p: '32px 28px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px',
                                        boxShadow:
                                            '0 1px 2px rgba(0,0,0,.4), 0 18px 40px -28px rgba(0,0,0,1)',
                                    }}
                                >
                                    {mode.kicker ? (
                                        <Box sx={{ alignSelf: 'flex-start' }}>
                                            <Pill
                                                tone="neutral"
                                                size="sm"
                                                uppercase
                                            >
                                                {mode.kicker}
                                            </Pill>
                                        </Box>
                                    ) : null}

                                    <Typography
                                        component="h3"
                                        sx={{
                                            m: 0,
                                            fontFamily:
                                                "'Space Grotesk', system-ui, sans-serif",
                                            fontSize: '26px',
                                            fontWeight: 700,
                                            letterSpacing: '-.02em',
                                            color: '#FFFFFF',
                                        }}
                                    >
                                        {mode.name}
                                    </Typography>

                                    <Typography
                                        component="p"
                                        sx={{
                                            m: 0,
                                            fontSize: '16px',
                                            lineHeight: 1.55,
                                            color: '#C6CCD8',
                                        }}
                                    >
                                        {mode.promise}
                                    </Typography>

                                    <Box
                                        component="ul"
                                        sx={{
                                            m: '6px 0 0',
                                            p: 0,
                                            listStyle: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                        }}
                                    >
                                        {bullets.map((bullet) => (
                                            <Box
                                                key={bullet}
                                                component="li"
                                                sx={{
                                                    display: 'flex',
                                                    gap: '12px',
                                                    fontSize: '14px',
                                                    lineHeight: 1.55,
                                                    color: '#98A0B0',
                                                }}
                                            >
                                                <Box
                                                    component="span"
                                                    aria-hidden="true"
                                                    sx={{
                                                        flex: 'none',
                                                        width: '6px',
                                                        height: '6px',
                                                        mt: '8px',
                                                        borderRadius: '50%',
                                                        bgcolor: '#8855DF',
                                                    }}
                                                />
                                                <span>{bullet}</span>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                )}
            </Box>
        </Section>
    )
}

WorkModes.propTypes = {
    workModes: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            kicker: PropTypes.string,
            promise: PropTypes.string,
            bullets: PropTypes.arrayOf(PropTypes.string),
        })
    ),
}

export default WorkModes
