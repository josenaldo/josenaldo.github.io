import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: null,
  type: null,
}

const ALERT_TIMEOUT = 5000
const ALERT_TYPES = {
  SUCCESS: 'alert-success',
  INFO: 'alert-info',
  WARNING: 'alert-warning',
  ERROR: 'alert-error',
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.message = action.payload.message
      state.type = action.payload.type
    },

    removeAlert: (state) => {
      state.message = null
      state.type = null
    },
  },
})

export { ALERT_TYPES, ALERT_TIMEOUT }
export const { setAlert, removeAlert } = alertSlice.actions
export default alertSlice.reducer
