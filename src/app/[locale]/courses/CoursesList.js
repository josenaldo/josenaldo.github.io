// Corrige spec/03-paginas-internas.md §10: era um Accordion por curso, com o
// corpo em MDX expandido ("sem descrição longa: curso é registro, não
// narrativa" — o corpo nunca aparece mais). Vira grade de cards (3 colunas:
// 36 cursos, bem acima do limiar de 8 que a spec usa pra decidir entre
// 1fr 1fr e repeat(3,1fr)).

'use client'

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Pill from '@/components/Pill'

const CoursesList = ({ courses }) => {
    const t = useTranslations('Courses')

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    lg: 'repeat(3, 1fr)',
                },
                gap: '16px',
            }}
        >
            {courses.map((course) => {
                const year = course.completionDate?.slice(0, 4)

                return (
                    <Box
                        key={course.slug}
                        sx={{
                            bgcolor: '#14181F',
                            borderRadius: '18px',
                            p: '22px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        {course.courseLink ? (
                            <Box
                                component="a"
                                href={course.courseLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    fontFamily:
                                        "'Space Grotesk', system-ui, sans-serif",
                                    fontSize: '21px',
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    color: '#FFFFFF',
                                    textDecoration: 'none',
                                    '&:hover': { color: '#E9ECF2' },
                                }}
                            >
                                {course.name}
                            </Box>
                        ) : (
                            <Typography
                                component="h2"
                                sx={{
                                    m: 0,
                                    fontFamily:
                                        "'Space Grotesk', system-ui, sans-serif",
                                    fontSize: '21px',
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    color: '#FFFFFF',
                                }}
                            >
                                {course.name}
                            </Typography>
                        )}

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
                            {course.institution}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                mt: '4px',
                            }}
                        >
                            {year ? <Pill tone="amber">{year}</Pill> : null}
                            {course.workload ? (
                                <Pill tone="neutral">
                                    {t('workloadHours', { hours: course.workload })}
                                </Pill>
                            ) : null}
                        </Box>

                        {course.certificateLink ? (
                            <Box
                                component="a"
                                href={course.certificateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    mt: 'auto',
                                    pt: '4px',
                                    fontSize: '14px',
                                    color: '#B69BF0',
                                    textDecoration: 'none',
                                    '&:hover': { color: '#CDBBF8' },
                                }}
                            >
                                {t('certificate')} →
                            </Box>
                        ) : null}
                    </Box>
                )
            })}
        </Box>
    )
}

export default CoursesList
