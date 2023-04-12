import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { increment, decrement, zero } from '@/reducers/counterReducer'
import { setAlert, ALERT_TYPES } from '@/reducers/alertReducer'

import './Counter.css'

/**
 * A counter component that increments and decrements a number
 * @function
 * @returns {JSX.Element} - The Counter component
 */
const Counter = () => {
  const dispatch = useDispatch()

  const counter = useSelector((state) => state.counter)

  const handleDecrement = () => {
    dispatch(decrement())
    dispatch(
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: 'Counter decremented',
      })
    )
  }

  const handleZero = () => {
    dispatch(zero())
    dispatch(
      setAlert({
        type: ALERT_TYPES.INFO,
        message: 'Counter reset to zero',
      })
    )
  }

  const handleIncrement = () => {
    dispatch(increment())
    dispatch(
      setAlert({
        type: ALERT_TYPES.SUCCESS,
        message: 'Counter incremented',
      })
    )
  }

  return (
    <div>
      <h2>Click for count!</h2>
      <div className="count">{counter}</div>
      <div className="grid">
        <button className="danger" onClick={handleDecrement}>
          Minus -
        </button>
        <button className="info" onClick={handleZero}>
          Zero
        </button>
        <button className="success" onClick={handleIncrement}>
          Plus +
        </button>
      </div>
    </div>
  )
}

export default Counter
