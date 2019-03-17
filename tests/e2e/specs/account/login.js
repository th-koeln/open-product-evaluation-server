describe('Account', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.exec('npm run seed')
    cy.visit('/')
  })

  it('Should login admin user', function() {
    cy.contains('.login__title', 'Open Product Evaluation')

    cy.login(this.admin.email, this.admin.password)

    cy.url()
      .should('include', '/survey')
  })

  it('Should logout admin user', function() {
    cy.contains('.login__title', 'Open Product Evaluation')

    cy.login(this.admin.email, this.admin.password)
    
    cy.url()
      .should('include', '/survey')

    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__logout')
      .click()

    cy.contains('.login__title', 'Open Product Evaluation')
  })
})