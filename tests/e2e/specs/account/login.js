describe('Account', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    //cy.exec('npm run seed')
    cy.visit('/')
  })

  it('Login', function() {
    cy.contains('.login__title', 'Open Product Evaluation')

    cy.login(this.admin.email, this.admin.password)

    cy.get('.navigation__user .dropdown-toggle span')
      .should('contain', 'Jane Doe')
  })

  it('Logout', function() {
    cy.contains('.login__title', 'Open Product Evaluation')

    cy.login(this.admin.email, this.admin.password)

    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__logout')
      .click()

    cy.contains('.login__title', 'Open Product Evaluation')
  })
})