import { createSlice } from '@reduxjs/toolkit'

const initialState = 0

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      return state + 1
    },
    decrement: (state) => {
      return state - 1
    },
    // eslint-disable-next-line no-unused-vars
    zero: (state) => {
      return 0
    },
  },
})

export const { increment, decrement, zero } = counterSlice.actions
export default counterSlice.reducer
