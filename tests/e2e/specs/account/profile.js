describe('Profile', () => {

  beforeEach(() => {
    cy.exec('npm run seed')
    cy.visit('/')
    cy.login('jane@doe.com', 'password')
  })

  it('update profile', () => {

    cy.get('.b-nav-dropdown')
      .click()

    cy.get('.b-nav-dropdown .dropdown-menu a:first-child')
      .click()

    cy.url()
      .should('contain', '/#/profile')

    cy.get('#input_firstname')
      .clear()
      .type('Jasonn')

    cy.get('.btn-primary')
      .click()

    cy.visit('/#/survey')

    cy.visit('/#/profile')
      .get('#input_firstname')
      .should('have.value', 'Jasonn')

  })
})