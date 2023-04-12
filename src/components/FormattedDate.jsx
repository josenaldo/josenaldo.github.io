import React from 'react'
import PropTypes from 'prop-types'
import { parseISO, format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

/**
 * Component that formats a date string and displays it in a <time> element.
 * Uses the date-fns library for parsing and formatting dates.
 *
 * @component
 *
 * @param {Object} props - The props object.
 * @param {string} props.dateString - The ISO 8601 date string to format and display.
 *
 * @returns {JSX.Element} - The rendered <time> element containing the formatted date, or null if no dateString is provided.
 *
 * @example
 * <FormattedDate dateString="2022-03-17T14:30:00.000Z" />
 */
const FormattedDate = ({ dateString }) => {
  if (!dateString) {
    return null
  }

  const date = utcToZonedTime(parseISO(dateString), 'America/Sao_Paulo')

  return (
    <time dateTime={dateString} role="time">
      {format(date, 'dd/MM/yyyy hh:mm')}
    </time>
  )
}

FormattedDate.propTypes = {
  dateString: PropTypes.string.isRequired,
}

export default FormattedDate
