import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:${process.env.PORT || 3000}`,
    env: {
      BACKEND: `${process.env.BACKEND || 'http://localhost:3001'}`,
    },
    // setupNodeEvents(on, config) {
    // implement node event listeners here
    // },
  },
})
