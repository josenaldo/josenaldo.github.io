import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

import FormattedDate from '@/components/FormattedDate'

describe('<FormattedDate />', () => {
  it('should render a <time> element', () => {
    const dateString = '2022-03-17T14:30:00.000Z'

    render(<FormattedDate dateString={dateString} />)

    expect(screen.getByRole('time')).toBeInTheDocument()
  })

  it('should format and display the date string in the correct format', () => {
    const dateString = '2022-03-17T14:30:00.000Z'
    const expectedDateString = '17/03/2022 11:30'

    render(<FormattedDate dateString={dateString} />)

    expect(screen.getByRole('time')).toHaveTextContent(expectedDateString)
  })

  it('should render null no dateString prop is provided', () => {
    const { container } = render(<FormattedDate />)

    expect(container.firstChild).toBeNull()
  })

  it('should throw an error if an invalid dateString prop is provided', () => {
    expect(() => {
      render(<FormattedDate dateString="invalid" />)
    }).toThrowError(/Invalid/)
  })
})
