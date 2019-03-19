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
Cypress.Commands.add('login', (email, password) => {

  cy.visit('/')
  
  cy.get('#input_email')
    .type(email)
    .get('#input_password')
    .type(password)
    .get('.btn-primary')
    .click()
    .url()
    .should('include', '/survey')
})

Cypress.Commands.add('activateSurvey', (email, password) => {

  cy.login(email, password)

  cy.visit('/#/survey')

  cy.visit('/#/survey')
    .get('.surveys__grid .card:first-child .survey__details')
    .click()

  cy.get('.survey__state .dropdown-toggle')
    .click()

  cy.get('.survey__state .dropdown-item:last-child')
    .click()

  cy.get('#input_title')
    .should('not.be.disabled')
    .should('not.have.value', '')
})

Cypress.Commands.add('visitSurvey', (id) => {
  cy.visit(`/#/survey/${id}`)
})

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
