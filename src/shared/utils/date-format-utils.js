import { formatInTimeZone } from 'date-fns-tz'

function formatDate(date) {
  return formatInTimeZone(date, 'UTC', 'dd/MM/yyyy')
}

export { formatDate }
