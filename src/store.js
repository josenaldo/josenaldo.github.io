import { configureStore } from '@reduxjs/toolkit'

import counterReducer from '@/reducers/counterReducer'
import alertReducer from '@/reducers/alertReducer'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    alert: alertReducer,
  },
})

export default store
