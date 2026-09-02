// Corrige D-06: era <ul> com bolinha e título centralizado; passa a ser
// spine 360px + cinco cards numerados em âmbar.
//
// `Home.isThisYou.symptoms` continua sendo um array de strings em
// messages/{en,pt}.json. A numeração é derivada do índice — não vai no texto.

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import SectionHeader from '@/components/SectionHeader'

const IsThisYou = () => {
    const t = useTranslations('Home.isThisYou')
    const symptoms = t.raw('symptoms')

    return (
        <Section surface="default" padTop={76} padBottom={76}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '360px 1fr' },
                    gap: { xs: '32px', lg: '56px' },
                    alignItems: 'start',
                }}
            >
                <SectionHeader title={t('title')} variant="spine" />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        minWidth: 0,
                    }}
                >
                    {symptoms.map((symptom, index) => (
                        <Box
                            key={symptom}
                            sx={{
                                display: 'flex',
                                gap: '18px',
                                p: '18px 22px',
                                borderRadius: '14px',
                                bgcolor: '#14181F',
                            }}
                        >
                            <Box
                                component="span"
                                aria-hidden="true"
                                sx={{
                                    fontFamily:
                                        "'IBM Plex Mono', ui-monospace, monospace",
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#FFAA00',
                                    pt: '4px',
                                    flex: 'none',
                                }}
                            >
                                {String(index + 1).padStart(2, '0')}
                            </Box>
                            <Typography
                                component="p"
                                sx={{
                                    m: 0,
                                    fontSize: '17px',
                                    lineHeight: 1.5,
                                    color: '#D5DAE4',
                                }}
                            >
                                {symptom}
                            </Typography>
                        </Box>
                    ))}

                    <Typography
                        component="p"
                        sx={{
                            m: 0,
                            pt: '14px',
                            fontFamily: "'Space Grotesk', system-ui, sans-serif",
                            fontSize: '19px',
                            fontWeight: 600,
                            lineHeight: 1.4,
                            color: '#FFFFFF',
                        }}
                    >
                        {t('closing')}
                    </Typography>
                </Box>
            </Box>
        </Section>
    )
}

export default IsThisYou
