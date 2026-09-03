// Corrige D-08. Régua: handoff-site/preview/Home.dc.html, bloco `02`.
//
// Quatro mudanças estruturais:
//  1. linha de topo com título+role à esquerda e período em PÍLULA à direita;
//  2. ARRIVED / BUILT em grid 1fr 1fr (empilhavam na largura toda);
//  3. o bloco Result passa a usar ResultBlock — número grande, não rótulo;
//  4. nota de rodapé explicando o marcador ● (a legenda estava perdida).
//
// A curadoria RESULT_METRICS_BY_ENGAGEMENT é conteúdo aprovado: não mexer.
// `Metrics.<id>.resultCaption` é uma chave NOVA (ver spec/05-i18n.md): é a
// legenda do número dentro do bloco Result, mais explícita que o label
// ("approved request to production (was 3–6 months)" em vez de "Release
// cadence"). Sem ela, o componente cai no label — não quebra.

'use client'

import { Box, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import Pill from '@/components/Pill'
import ResultBlock from '@/components/ResultBlock'
import Section from '@/components/Section'
import SectionHeader from '@/components/SectionHeader'
import metrics from '@/data/metrics.mjs'
import { metricPlainCount, metricSideValue } from '@/lib/metricValue'

// Curadoria revisada em 2026-09-02. Duas coisas mudaram:
//
// 1. `deploymentFrequency` saiu do primeiro cartão e entrou `productLeadTime`.
//    O cartão mostrava a CADÊNCIA DE RELEASE (4×/month) sob a legenda do LEAD
//    TIME ("approved request to production, was 3–6 months") — valor de uma
//    métrica com a legenda de outra. `productLeadTime` já existia no canônico
//    e não era usado em lugar nenhum.
//
// 2. `deployDuration` e `followUpOperation` saíram porque a prosa do Result,
//    logo abaixo, já conta os dois. O critério é o do mock: o cartão leva o
//    que a prosa não diz, e a prosa leva o que não vira número.
// Métricas cuja legenda de Result já carrega o período: o valor entra sem a
// unidade, senão "~5×/month" fica sob "issues a month" e diz duas vezes.
const PLAIN_COUNT_IN_RESULT = new Set(['clientReportedIssues'])

const RESULT_METRICS_BY_ENGAGEMENT = {
    medespecialista: [
        'productLeadTime',
        'automatedTests',
        'clientReportedIssues',
        'downtime',
    ],
    muvz: [
        'muvzPerformance',
        'muvzMicroservices',
        'muvzDelay',
        'muvzSprintCadence',
    ],
    conddiz: ['conddizTrafficPeak', 'conddizArchitecture'],
}

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
    m: 0,
    fontSize: '15px',
    lineHeight: 1.65,
    color: '#B4BCCA',
}

const Engagements = ({ engagements }) => {
    const t = useTranslations('Home.engagements')
    const tMetrics = useTranslations('Metrics')
    const locale = useLocale()
    const visibleEngagements = Array.isArray(engagements) ? engagements : []

    return (
        <Section surface="default" padTop={76} padBottom={76} id="engagements">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                <SectionHeader n="02" title={t('title')} />

                {visibleEngagements.length === 0 ? (
                    <Typography sx={{ color: '#98A0B0' }}>
                        {t('emptyState')}
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                        }}
                    >
                        {visibleEngagements.map((engagement) => {
                            const metricIds =
                                RESULT_METRICS_BY_ENGAGEMENT[
                                    engagement.translationKey
                                ] ?? []

                            const resultItems = metricIds.map((id) => {
                                const metric = metrics[id]

                                // `resultValue` existe para a métrica cujo
                                // valor precisa de unidade para se sustentar
                                // sozinho no cartão: `15` não diz 15 o quê,
                                // `1` não diz uma semana. Quem não tem a
                                // chave cai no valor cru, como antes.
                                const raw = PLAIN_COUNT_IN_RESULT.has(id)
                                    ? metricPlainCount(metric.after, locale)
                                    : metricSideValue(metric.after, locale)

                                return {
                                    value: tMetrics.has(`${id}.resultValue`)
                                        ? tMetrics(`${id}.resultValue`, {
                                              value: raw,
                                          })
                                        : raw,
                                    caption: tMetrics.has(`${id}.resultCaption`)
                                        ? tMetrics(`${id}.resultCaption`)
                                        : tMetrics(`${id}.label`),
                                    confidence: metric.after.confidence,
                                }
                            })

                            return (
                                <Box
                                    key={engagement.title}
                                    sx={{
                                        bgcolor: '#14181F',
                                        borderRadius: '20px',
                                        p: { xs: '24px', md: '32px' },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '26px',
                                        boxShadow:
                                            '0 1px 2px rgba(0,0,0,.4), 0 24px 50px -34px rgba(0,0,0,1)',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: {
                                                xs: 'column',
                                                md: 'row',
                                            },
                                            alignItems: {
                                                xs: 'flex-start',
                                                md: 'flex-start',
                                            },
                                            justifyContent: 'space-between',
                                            gap: { xs: '12px', md: '32px' },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                            }}
                                        >
                                            <Typography
                                                component="h3"
                                                sx={{
                                                    m: 0,
                                                    fontFamily:
                                                        "'Space Grotesk', system-ui, sans-serif",
                                                    fontSize: '24px',
                                                    fontWeight: 600,
                                                    letterSpacing: '-.01em',
                                                    lineHeight: 1.25,
                                                    color: '#E9ECF2',
                                                }}
                                            >
                                                {engagement.title}
                                            </Typography>
                                            <Typography
                                                component="p"
                                                sx={{
                                                    m: 0,
                                                    fontFamily:
                                                        "'IBM Plex Mono', ui-monospace, monospace",
                                                    fontSize: '12px',
                                                    color: '#7C8494',
                                                }}
                                            >
                                                {engagement.role}
                                            </Typography>
                                        </Box>

                                        {engagement.period ? (
                                            <Pill tone="quiet">
                                                {engagement.period}
                                            </Pill>
                                        ) : null}
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: '1fr',
                                                md: '1fr 1fr',
                                            },
                                            gap: '28px',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                            }}
                                        >
                                            <Typography
                                                component="p"
                                                sx={LABEL_SX}
                                            >
                                                {t('arrived')}
                                            </Typography>
                                            <Typography
                                                component="p"
                                                sx={BODY_SX}
                                            >
                                                {engagement.arrived}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                            }}
                                        >
                                            <Typography
                                                component="p"
                                                sx={LABEL_SX}
                                            >
                                                {t('built')}
                                            </Typography>
                                            <Typography
                                                component="p"
                                                sx={BODY_SX}
                                            >
                                                {engagement.built}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <ResultBlock
                                        label={t('result')}
                                        items={resultItems}
                                        body={engagement.result}
                                    />
                                </Box>
                            )
                        })}
                    </Box>
                )}

                <Typography
                    component="p"
                    sx={{
                        m: 0,
                        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                        fontSize: '12px',
                        lineHeight: 1.7,
                        color: '#7C8494',
                    }}
                >
                    {t('footnote')}
                </Typography>
            </Box>
        </Section>
    )
}

Engagements.propTypes = {
    engagements: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            role: PropTypes.string,
            period: PropTypes.string,
            arrived: PropTypes.string,
            built: PropTypes.string,
            result: PropTypes.string,
            translationKey: PropTypes.string,
        })
    ),
}

export default Engagements
