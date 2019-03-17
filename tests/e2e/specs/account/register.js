describe('Register', () => {

  beforeEach(() => {
    cy.fixture('users/register').as('register')
    cy.exec('npm run seed')
    cy.visit('/#/register')
  })

  it('Should register new user', function() {

    cy.get('#input_firstname')
      .type(this.register.firstName)

    cy.get('#input_lastname')
      .type(this.register.lastName)

    cy.get('#input_email')
      .type(this.register.email)

    cy.get('#input_password')
      .type(this.register.password)

    cy.get('#input_password_repeat')
      .type(this.register.password)

    cy.get('.btn-primary')
      .click()
    
    cy.url()
      .should('include', '/survey')
  })
})