import { ALERT_TYPE } from 'components/Alert'

const HTTP_STATUS = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
}

const ERROR_CODES = {
  NETWORK_ERROR: 'ERR_NETWORK',
  CANCELED: 'ERR_CANCELED',
}

const createErrorDetails = (statusCode, errorMessage, errorDetails) => {
  console.log('statusCode', statusCode)
  console.log('errorMessage', errorMessage)
  console.log('errorDetails', errorDetails)

  let details = {}

  if (statusCode) {
    details.statusCode = statusCode
  }

  if (errorMessage) {
    details.errorMessage = errorMessage
  }

  if (errorDetails) {
    details.errorDetails = errorDetails
  }

  return details
}

const handleAxiosError = (error, content) => {
  if (error === null) {
    return {
      type: ALERT_TYPE.ERROR,
      content,
      error: {
        messageError: 'Error is null',
      },
    }
  }

  const response = error?.response
  const request = error?.request
  const statusCode = response?.status

  let errorMessage = null
  let errorDetails = null

  if (response) {
    errorDetails = error.response.data.error

    if (statusCode === HTTP_STATUS.NOT_FOUND) {
      errorMessage = 'The requested resource does not exist or has been deleted'
    } else if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
      errorMessage = 'Please login to access this resource'
    } else {
      errorMessage = error.message
    }
  } else if (request) {
    if (error.code === ERROR_CODES.NETWORK_ERROR) {
      errorMessage = 'Connection problems. Please try again.'
    } else if (error.code === ERROR_CODES.CANCELED) {
      errorMessage = 'Connection canceled. Please try again.'
    } else {
      errorMessage = error.message
    }
  } else {
    errorMessage = error.message
  }

  const errorObject = createErrorDetails(statusCode, errorMessage, errorDetails)
  console.log('errorObject', errorObject)
  return {
    type: ALERT_TYPE.ERROR,
    content,
    error: errorObject,
  }
}

export default { handleAxiosError }
