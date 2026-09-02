'use client'

import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const MetricDelta = ({ label, before, after, unit, confidence }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="overline" component="p">
                {confidence === 'measured' && (
                    <Box
                        component="span"
                        aria-hidden="true"
                        sx={{ color: 'secondary.main', mr: 0.75 }}
                    >
                        ●
                    </Box>
                )}
                {label}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                {before && (
                    <>
                        <Typography
                            variant="caption"
                            component="span"
                            sx={(theme) => ({
                                textDecoration: 'line-through',
                                color: theme.ink.muted,
                            })}
                        >
                            {before}
                        </Typography>
                        <Box
                            component="span"
                            aria-hidden="true"
                            sx={{ color: 'secondary.main' }}
                        >
                            →
                        </Box>
                    </>
                )}
                <Typography
                    variant="h3"
                    component="span"
                    sx={{ whiteSpace: 'nowrap', fontWeight: 700 }}
                >
                    {after}
                </Typography>
            </Box>

            {unit && (
                <Typography
                    variant="caption"
                    component="p"
                    sx={(theme) => ({ color: theme.ink.muted })}
                >
                    {unit}
                </Typography>
            )}
        </Box>
    )
}

MetricDelta.propTypes = {
    label: PropTypes.string.isRequired,
    before: PropTypes.string,
    after: PropTypes.string.isRequired,
    unit: PropTypes.string,
    confidence: PropTypes.oneOf(['measured', 'counted', 'remembered'])
        .isRequired,
}

export default MetricDelta
