// Bloco de fecho reutilizável para páginas internas (hiring, about, ...).
// Mesmo tratamento visual do ClosingCta da home (spec/02-home.md §B9), mas
// parametrizado — cada página internas tem seu próprio título/corpo/CTA.
// Ver spec/03-paginas-internas.md §1 (Bloco 4) e §4.

'use client'

import { Box, Button, Typography } from '@mui/material'
import PropTypes from 'prop-types'

import { Link } from '@/i18n/navigation'

const CtaBlock = ({ title, body, ctaLabel, href, external = false }) => {
    const buttonProps = external
        ? { component: 'a', href, target: '_blank', rel: 'noopener noreferrer' }
        : { component: Link, href }

    return (
        <Box
            sx={{
                maxWidth: '1280px',
                mx: 'auto',
                px: { xs: '24px', md: '40px' },
            }}
        >
            <Box
                sx={{
                    bgcolor: '#8855DF',
                    borderRadius: '24px',
                    // Um degrau abaixo do ClosingCta da home: 56px em vez de
                    // 64/56. O CTA da home é o fecho do funil e deve pesar
                    // mais que o de uma página interna — é o que o mock
                    // desenha em CtaBlock.dc.html.
                    p: { xs: '36px 28px', md: '56px' },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: { xs: '28px', md: '48px' },
                    boxShadow: '0 30px 70px -40px rgba(136,85,223,1)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        maxWidth: '60ch',
                    }}
                >
                    <Typography
                        component="h2"
                        sx={{
                            m: 0,
                            fontFamily: "'Space Grotesk', system-ui, sans-serif",
                            fontSize: { xs: '30px', md: '38px' },
                            fontWeight: 700,
                            letterSpacing: '-.02em',
                            lineHeight: 1.1,
                            color: '#FFFFFF',
                        }}
                    >
                        {title}
                    </Typography>
                    {body ? (
                        <Typography
                            component="p"
                            sx={{
                                m: 0,
                                fontSize: { xs: '16px', md: '18px' },
                                lineHeight: 1.55,
                                color: '#EDE4FF',
                                textWrap: 'pretty',
                            }}
                        >
                            {body}
                        </Typography>
                    ) : null}
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    {...buttonProps}
                    sx={{
                        flexShrink: 0,
                        // Ver ClosingCta: em 360px o rótulo com `nowrap`
                        // mede mais que a área útil do cartão e vazava.
                        width: { xs: '100%', md: 'auto' },
                        bgcolor: '#FFFFFF',
                        color: '#3B1E77',
                        fontSize: { xs: '16px', md: '17px' },
                        fontWeight: 600,
                        p: { xs: '16px 20px', md: '18px 32px' },
                        borderRadius: '12px',
                        boxShadow: 'none',
                        whiteSpace: { xs: 'normal', md: 'nowrap' },
                        '&:hover': {
                            bgcolor: '#F3EDFF',
                            boxShadow: 'none',
                        },
                    }}
                >
                    {ctaLabel}
                </Button>
            </Box>
        </Box>
    )
}

CtaBlock.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string,
    ctaLabel: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    external: PropTypes.bool,
}

export default CtaBlock
