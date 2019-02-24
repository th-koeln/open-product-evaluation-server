describe('Account', () => {

  beforeEach(() => {
    cy.exec('npm run seed')
    cy.visit('/')
  })

  it('Login', () => {
    cy.visit('/')
    cy.contains('.login__title', 'Open Product Evaluation')

    cy.login('jane@doe.com', 'password')

    cy.get('.navbar .dropdown-toggle span')
      .should('contain', 'Jane Doe')
  })

  it('Logout', () => {
    cy.login('jane@doe.com', 'password')

    cy.get('.b-nav-dropdown')
      .click()

    cy.get('.b-nav-dropdown .dropdown-menu a:last-child')
      .click()

    cy.contains('.login__title', 'Open Product Evaluation')
  })
})