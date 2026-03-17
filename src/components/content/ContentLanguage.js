import { Chip } from '@mui/material'
import PropTypes from 'prop-types'

const LANGUAGE_LABELS = {
    pt: 'pt-br',
    en: 'en-us',
}

const ContentLanguage = ({ language, color = 'primary' }) => {
    const normalizedLanguage = String(language ?? '').trim().toLowerCase()
    const label = LANGUAGE_LABELS[normalizedLanguage]

    if (!label) return null

    return (
        <Chip
            size="small"
            color={color}
            label={label}
            sx={{
                fontWeight: 700,
                letterSpacing: '0.04em',
            }}
        />
    )
}

ContentLanguage.propTypes = {
    language: PropTypes.string,
    color: PropTypes.string,
}

export default ContentLanguage