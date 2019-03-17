describe('Profile', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.exec('npm run seed')
  })

  it('update profile', function() {
    cy.visit('/')
    cy.login(this.admin.email, this.admin.password)

    cy.url()
      .should('contain', '/#/survey')

    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__profile')
      .click()

    cy.url()
      .should('contain', '/#/profile')

    cy.get('#input_firstname')
      .clear()
      .type(this.admin.firstName + 'e')

    cy.get('.btn-primary')
      .click()

    cy.visit('/#/survey')

    cy.visit('/#/profile')
      .get('#input_firstname')
      .should('have.value', this.admin.firstName + 'e')
  })
})