import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Togglable from '@/components/Togglable'

describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="Show...">
        <div className="testDiv">togglable content</div>
      </Togglable>
    ).container
  })

  test('at start the children are not rendered', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toBeNull()
  })

  test('after clicking the button, children are rendered', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('Show...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).toBeDefined()
  })

  test('after another clicking the button, children are not rendered', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('Show...')
    await user.click(button)

    const closeButton = screen.getByText('Cancel')
    await user.click(closeButton)

    const div = container.querySelector('.togglableContent')
    expect(div).toBeNull()
  })
})
