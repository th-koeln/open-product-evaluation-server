describe('Register', () => {

  beforeEach(() => {
    cy.exec('npm run seed')
    cy.visit('/#/register')
  })

  it('Fail Register: E-Mail', () => {

    cy.get('#input_firstname')
      .type('Jason')

    cy.get('#input_lastname')
      .type('Doe')

    cy.get('#input_email')
      .type('jason@doe')

    cy.get('#input_password')
      .type('123456')

    cy.get('#input_password_repeat')
      .type('123456')

    cy.get('.btn-primary')
      .click()

    cy.contains('.invalid-feedback', 'Email needs to be valid')
  })

  it('Fail Register: Password', () => {

    cy.get('#input_firstname')
      .type('Jason')

    cy.get('#input_lastname')
      .type('Doe')

    cy.get('#input_email')
      .type('jason@doe.com')

    cy.get('#input_password')
      .type('123456')

    cy.get('#input_password_repeat')
      .type('1234567')

    cy.get('.btn-primary')
      .click()

    cy.contains('.invalid-feedback', 'Your passwords don\'t match')
  })

  it('Register', () => {

    cy.get('#input_firstname')
      .type('Jason')

    cy.get('#input_lastname')
      .type('Doe')

    cy.get('#input_email')
      .type('jason@doe.com')

    cy.get('#input_password')
      .type('123456')

    cy.get('#input_password_repeat')
      .type('123456')

    cy.get('.btn-primary')
      .click()
    
    cy.url()
      .should('include', '/survey')
      .get('.navbar .dropdown-toggle span')
      .should('contain', 'Jason Doe')
  })
})