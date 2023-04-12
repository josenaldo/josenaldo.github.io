import React from 'react'

import Counter from '@/components/Counter'
import Togglable from '@/components/Togglable'
import Alert from '@/components/Alert'

import './App.css'

const App = () => {
  return (
    <div className="container">
      <main>
        <Alert />

        <h1>Counter</h1>

        <Togglable buttonLabel="Open">
          <Counter />
        </Togglable>
      </main>
    </div>
  )
}

export default App
