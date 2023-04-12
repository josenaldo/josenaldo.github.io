import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { useSelector, useDispatch } from 'react-redux'
import Alert from '@/components/Alert'
import {
  ALERT_TYPES,
  removeAlert,
  ALERT_TIMEOUT,
} from '@/reducers/alertReducer'

jest.mock('react-redux')

describe('<Alert />', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()

    useDispatch.mockReturnValue(dispatchMock)
  })

  describe('when no alert is set ', () => {
    beforeEach(() => {
      useSelector.mockImplementation((selectorFn) =>
        selectorFn({
          alert: {
            message: null,
            type: null,
          },
        })
      )

      render(<Alert />)
    })

    it('does not render when there is no alert', () => {
      const alertElement = screen.queryByRole('alert')
      expect(alertElement).not.toBeInTheDocument()
    })
  })

  describe('when an alert is set', () => {
    beforeEach(() => {
      useSelector.mockImplementation((selectorFn) =>
        selectorFn({
          alert: {
            message: 'Success Message',
            type: ALERT_TYPES.SUCCESS,
          },
        })
      )

      render(<Alert />)
    })

    it('dispatches removeAlert action when close button is clicked', async () => {
      const closeButton = screen.getByText('×')
      await userEvent.click(closeButton)

      expect(dispatchMock).toHaveBeenCalledTimes(1)
      expect(dispatchMock).toHaveBeenCalledWith(removeAlert())
    })

    it('sets a timeout to remove the alert after ALERT_TIMEOUT ms', () => {
      jest.useFakeTimers()

      render(<Alert />)

      expect(dispatchMock).not.toHaveBeenCalled()

      jest.advanceTimersByTime(ALERT_TIMEOUT)

      expect(dispatchMock).toHaveBeenCalledTimes(1)
      expect(dispatchMock).toHaveBeenCalledWith(removeAlert())

      jest.useRealTimers()
    })
  })

  describe('when a type of alert is set', () => {
    it('renders success alert message and type correctly', () => {
      useSelector.mockImplementation((selectorFn) =>
        selectorFn({
          alert: {
            message: 'Success Message',
            type: ALERT_TYPES.SUCCESS,
          },
        })
      )

      render(<Alert />)

      const alertElement = screen.getByRole('alert')

      expect(alertElement).toBeInTheDocument()
      expect(alertElement).toHaveClass('alert-success')

      const messageElement = screen.getByText('Success Message')
      expect(messageElement).toBeInTheDocument()
    })

    it('renders alert details correctly', () => {
      useSelector.mockImplementation((selectorFn) =>
        selectorFn({
          alert: {
            message: 'Success Message',
            type: ALERT_TYPES.SUCCESS,
            details: 'Success Details',
          },
        })
      )

      render(<Alert />)

      const alertElement = screen.getByRole('alert')

      expect(alertElement).toBeInTheDocument()
      expect(alertElement).toHaveClass('alert-success')

      const messageElement = screen.getByText('Success Message')
      expect(messageElement).toBeInTheDocument()

      const detailsElement = screen.getByText('Success Details')
      expect(detailsElement).toBeInTheDocument()
    })

    it('renders info alert message and type correctly', () => {
      useSelector.mockImplementation((selectorFn) =>
        selectorFn({
          alert: {
            message: 'Info Message',
            type: ALERT_TYPES.INFO,
          },
        })
      )

      render(<Alert />)

      const alertElement = screen.getByRole('alert')

      expect(alertElement).toBeInTheDocument()
      expect(alertElement).toHaveClass('alert-info')

      const messageElement = screen.getByText('Info Message')
      expect(messageElement).toBeInTheDocument()
    })

    it('renders warning alert message and type correctly', () => {
      useSelector.mockImplementation((selectorFn) =>
        selectorFn({
          alert: {
            message: 'Warning Message',
            type: ALERT_TYPES.WARNING,
          },
        })
      )

      render(<Alert />)

      const alertElement = screen.getByRole('alert')

      expect(alertElement).toBeInTheDocument()
      expect(alertElement).toHaveClass('alert-warning')

      const messageElement = screen.getByText('Warning Message')
      expect(messageElement).toBeInTheDocument()
    })

    it('renders error alert message and type correctly', () => {
      useSelector.mockImplementation((selectorFn) =>
        selectorFn({
          alert: {
            message: 'Error Message',
            type: ALERT_TYPES.ERROR,
          },
        })
      )

      render(<Alert />)

      const alertElement = screen.getByRole('alert')

      expect(alertElement).toBeInTheDocument()
      expect(alertElement).toHaveClass('alert-error')

      const messageElement = screen.getByText('Error Message')
      expect(messageElement).toBeInTheDocument()
    })

    it('renders error details if error object is provided', () => {
      useSelector.mockImplementation((selectorFn) =>
        selectorFn({
          alert: {
            type: ALERT_TYPES.ERROR,
            message: 'Error Message',
            error: {
              statusCode: 404,
              errorMessage: 'Page not found',
              errorDetails: 'The requested page does not exist',
            },
          },
        })
      )

      render(<Alert />)

      const alertElement = screen.getByRole('alert')

      expect(alertElement).toBeInTheDocument()
      expect(alertElement).toHaveClass('alert-error')

      const messageElement = screen.getByText('Error Message')
      expect(messageElement).toBeInTheDocument()

      const statusCode = screen.getByText('Status code: 404')
      expect(statusCode).toBeInTheDocument()

      const messageError = screen.getByText('Message Error: Page not found')
      expect(messageError).toBeInTheDocument()

      const errorDetails = screen.getByText(
        'Details: The requested page does not exist'
      )
      expect(errorDetails).toBeInTheDocument()
    })
  })
})
