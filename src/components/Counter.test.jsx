import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { increment, decrement, zero } from '@/reducers/counterReducer'

import Counter from './Counter'

const mockStore = configureStore([])

describe('<Counter />', () => {
  let store
  let user

  beforeEach(() => {
    store = mockStore({ counter: 0, notification: {} })

    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    ).container

    user = userEvent.setup()
  })

  it('should render buttons and count', () => {
    expect(screen.getByText('Minus -')).toBeInTheDocument()
    expect(screen.getByText('Zero')).toBeInTheDocument()
    expect(screen.getByText('Plus +')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should dispatch increment action when Plus button is clicked', async () => {
    const button = screen.getByText('Plus +')
    await user.click(button)

    expect(store.getActions()).toContainEqual(increment())
  })

  it('should dispatch decrement action when Minus button is clicked', async () => {
    const button = screen.getByText('Minus -')
    await user.click(button)

    expect(store.getActions()).toContainEqual(decrement())
  })

  it('should dispatch zero action when Zero button is clicked', async () => {
    const button = screen.getByText('Zero')
    await user.click(button)

    expect(store.getActions()).toContainEqual(zero())
  })
})
