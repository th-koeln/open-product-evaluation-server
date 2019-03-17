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

  it('Should require email for login', function() {
    cy.get('#input_email')
      .type('email')
      .clear()
    
    cy.contains('.invalid-feedback', 'Email is required')
      .should('be.visible')

    cy.get('#input_email')
      .type('email')
      
    cy.contains('.invalid-feedback', 'Email is required')
      .should('not.be.visible')

    cy.get('#login')
      .click()
    
    cy.get('#input_email')
      .type('email')
      .clear()
    
    cy.contains('.invalid-feedback', 'Email is required')
      .should('be.visible')
  })

  it('Should require Password for login', function() {
    cy.get('#input_password')
      .type('password')
      .clear()
    
    cy.contains('.invalid-feedback', 'Password is required')
      .should('be.visible')

    cy.get('#input_password')
      .type('password')
      
    cy.contains('.invalid-feedback', 'Password is required')
      .should('not.be.visible')

    cy.get('#login')
      .click()
    
    cy.get('#input_password')
      .type('password')
      .clear()
    
    cy.contains('.invalid-feedback', 'Password is required')
      .should('be.visible')
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