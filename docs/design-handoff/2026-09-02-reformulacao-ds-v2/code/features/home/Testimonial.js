// Destino: src/features/home/Testimonial.js — SUBSTITUI o arquivo atual.
// Corrige D-10. Três erros de peso: a seção usava `paper` (#14181F) como
// FUNDO — que é a cor de card, não de seção; o título vinha em tamanho de h2
// cheio, competindo com Engagements; e a citação era âmbar itálico (o âmbar é
// reservado a rótulo e número).
//
// O bloco é deliberadamente leve: são os gatos. Ritmo 60/60, não 76/76.
// Cards horizontais em #12161C, avatar 46px, citação 14px itálico #C6CCD8.
//
// Chave nova: Home.testimonial.aside (o aparte em itálico ao lado do título).

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import CallToAction from '@/components/CallToAction'
import Section from '@/components/Section'
import SectionHeader from '@/components/SectionHeader'

const Testimonial = ({ testimonials }) => {
    const t = useTranslations('Home.testimonial')
    const visibleTestimonials = Array.isArray(testimonials) ? testimonials : []

    return (
        <Section surface="default" padTop={60} padBottom={60}>
            <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
                <SectionHeader
                    title={t('title')}
                    aside={t('aside')}
                    size="sm"
                />

                {visibleTestimonials.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '16px',
                            maxWidth: '70ch',
                        }}
                    >
                        <Typography sx={{ color: '#98A0B0' }}>
                            {t('emptyState')}
                        </Typography>
                        <CallToAction href="/contact">
                            {t('shareCta')}
                        </CallToAction>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'repeat(3, 1fr)',
                            },
                            gap: '16px',
                        }}
                    >
                        {visibleTestimonials.map((testimonial) => (
                            <Box
                                key={testimonial.name}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    bgcolor: '#12161C',
                                    borderRadius: '16px',
                                    p: '16px 18px',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    sx={{
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        flex: 'none',
                                    }}
                                />
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        component="p"
                                        sx={{
                                            m: 0,
                                            fontSize: '14px',
                                            lineHeight: 1.5,
                                            fontStyle: 'italic',
                                            color: '#C6CCD8',
                                        }}
                                    >
                                        {`\u201C${testimonial.testimonial}\u201D`}
                                    </Typography>
                                    <Typography
                                        component="p"
                                        sx={{
                                            m: '4px 0 0',
                                            fontFamily:
                                                "'IBM Plex Mono', ui-monospace, monospace",
                                            fontSize: '11px',
                                            color: '#7C8494',
                                        }}
                                    >
                                        {testimonial.name}
                                        {testimonial.position
                                            ? ` \u00B7 ${testimonial.position}`
                                            : ''}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Section>
    )
}

Testimonial.propTypes = {
    testimonials: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            position: PropTypes.string,
            testimonial: PropTypes.string,
            image: PropTypes.string,
        })
    ),
}

export default Testimonial
