describe('Register', () => {

  beforeEach(() => {
    cy.fixture('users/register').as('register')
    cy.exec('npm run seed')
    cy.visit('/#/register')
  })

  it('Should require first name', function() {
    cy.get('.btn-primary')
      .click()

    cy.contains('.invalid-feedback', 'Firstname is required')
  })

  it('Should require last name', function() {
    cy.get('.btn-primary')
      .click()
      
    cy.contains('.invalid-feedback', 'Lastname is required')
  })

  it('Should require email', function() {
    cy.get('.btn-primary')
      .click()
      
    cy.contains('.invalid-feedback', 'Email is required')
  })


  it('Should require password', function() {
    cy.get('.btn-primary')
      .click()
      
    cy.contains('.invalid-feedback', 'Password is required')
  })


  it('Should require repeated password', function() {
    cy.get('.btn-primary')
      .click()
      
    cy.contains('.invalid-feedback', 'You need to repeat the password')
  })

  it('Should require a valid email', function() {
    cy.get('#input_email')
      .type('email')

    cy.contains('.invalid-feedback', 'Email needs to be valid')
  })

  it('Should show error when password is to short', function() {
    cy.get('#input_password')
      .type('123')

    cy.contains('.invalid-feedback', 'Password needs to be atleast 4 characters long')    
  })

  it('Should show error when password does not match', function() {
    cy.get('#input_password')
      .type('1234')

    cy.get('#input_password_repeat')
      .type('12345')

    cy.contains('.invalid-feedback', 'Your passwords don\'t match')
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