// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// -- This is a custom command to reset backend database --
// Cypress.Commands.add('resetDatabase', () => {
//   cy.request('POST', `${Cypress.env('BACKEND')}/api/testing/reset`)
// })

// -- This is a custom command to add a user --
// Cypress.Commands.add('addUser', (user) => {
//   cy.request('POST', `${Cypress.env('BACKEND')}/api/users`, user)
// })

// -- This is a custom command to login --
// Cypress.Commands.add('login', ({ username, password }) => {
//   cy.request('POST', `${Cypress.env('BACKEND')}/api/login`, {
//     username: username,
//     password: password,
//   }).then((response) => {
//     localStorage.setItem(
//       Cypress.env('LOGGED_USER_KEY'),
//       JSON.stringify(response.body)
//     )
//     cy.visit('/')
//   })
// })
