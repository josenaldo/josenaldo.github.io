import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { removeAlert, ALERT_TIMEOUT } from '@/reducers/alertReducer'

import './Alert.css'

/**
 * Component that renders a message alert.
 *
 * @component
 *
 * @param {Object} props - The props object.
 * @param {Object} props.message - The message object to display.
 * @param {string} props.message.type - The type of the message (success, error, or info).
 * @param {string} props.message.content - The main content of the message.
 * @param {string} [props.message.details] - Additional details about the message.
 * @param {Object} [props.message.error] - The error object associated with the message.
 * @param {number} [props.message.error.statusCode] - The HTTP status code of the error.
 * @param {string} [props.message.error.errorMessage] - The error message.
 * @param {string} [props.message.error.errorDetails] - Additional details about the error.
 * @param {function} props.setMessage - The function to call when the alert is closed.
 *
 * @returns {JSX.Element|null} - The rendered message alert, or null if no message is provided.
 *
 * @example
 * <Alert message={{ type: 'success', content: 'The operation was successful' }} setMessage={setMessage} />
 */
const Alert = () => {
  const dispatch = useDispatch()
  const alert = useSelector((state) => state.alert)

  const close = () => {
    dispatch(removeAlert())
  }

  const timeoutRef = React.useRef()

  React.useEffect(() => {
    if (!alert?.message) {
      return
    }

    timeoutRef.current = setTimeout(() => {
      dispatch(removeAlert())
    }, ALERT_TIMEOUT)

    return () => clearTimeout(timeoutRef.current)
  }, [alert])

  if (!alert || !alert.message) {
    return null
  }

  return (
    <div className={`alert ${alert.type}`} role="alert">
      <span className="close-button" onClick={close}>
        &times;
      </span>
      <p className="alert-title">{alert.message}</p>
      {alert.details && <p>{alert.details}</p>}
      {alert.error && (
        <ul className="details">
          {alert.error.statusCode && (
            <li>Status code: {alert.error.statusCode}</li>
          )}
          {alert.error.errorMessage && (
            <li>Message Error: {alert.error.errorMessage}</li>
          )}
          {alert.error.errorDetails && (
            <li>Details: {alert.error.errorDetails}</li>
          )}
        </ul>
      )}
    </div>
  )
}

export default Alert
