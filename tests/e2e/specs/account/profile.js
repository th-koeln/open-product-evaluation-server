describe('Profile', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.exec('npm run seed')
  })

  it('Should show error on empty first name', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.url()
      .should('contain', '/#/survey')
    
    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__profile')
      .click()
    
    cy.get('#input_firstname')
      .should('have.value', this.admin.firstName)
      .clear()

    cy.contains('.invalid-feedback', 'Firstname is required')
      .should('be.visible')
  })

  it('Should show error on empty last name', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.url()
      .should('contain', '/#/survey')
    
    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__profile')
      .click()
    
    cy.get('#input_lastname')
      .should('have.value', this.admin.lastName)
      .clear()

    cy.contains('.invalid-feedback', 'Lastname is required')
      .should('be.visible')
  })

  it('Should show error on empty email', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.url()
      .should('contain', '/#/survey')
    
    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__profile')
      .click()
    
    cy.get('#input_email')
      .should('have.value', this.admin.email)
      .clear()

    cy.contains('.invalid-feedback', 'Email is required')
      .should('be.visible')
  })

  it('Should show error on invalid email', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.url()
      .should('contain', '/#/survey')
    
    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__profile')
      .click()
    
    cy.get('#input_email')
      .should('have.value', this.admin.email)
      .clear()
      .type('asdadasd')

    cy.contains('.invalid-feedback', 'Email needs to be valid')
      .should('be.visible')
  })

  it('Should show error when password is to short', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.url()
      .should('contain', '/#/survey')
    
    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__profile')
      .click()

    cy.get('#input_password')
      .type('123')
    
    cy.contains('.invalid-feedback', 'Password needs to be atleast 4 characters long')
      .should('be.visible')
  })

  it('Should show error when password does not match', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.url()
      .should('contain', '/#/survey')
    
    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__profile')
      .click()

    cy.get('#input_firstname')
      .should('have.value', this.admin.firstName)
    
    cy.get('#input_password')
      .type('123')
    
    cy.contains('.invalid-feedback', 'Your passwords don\'t match')
      .should('be.visible')
    
    cy.get('#input_password_repeat')
      .type('123')
    
    cy.contains('.invalid-feedback', 'Your passwords don\'t match')
      .should('not.be.visible')
  })

  it('Should update profile', function() {
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

    cy.get('#input_lastname')
      .clear()
      .type(this.admin.lastName + 'e')

    cy.get('#input_email')
      .clear()
      .type(this.admin.email + 'm')

    cy.get('.btn-primary')
      .click()

    cy.visit('/#/survey')

    cy.visit('/#/profile')
      .get('#input_firstname')
      .should('have.value', this.admin.firstName + 'e')

    cy.get('#input_lastname')
      .should('have.value', this.admin.lastName + 'e')

    cy.get('#input_email')
      .should('have.value', this.admin.email + 'm')
  })

  it('Should change password', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.url()
      .should('contain', '/#/survey')

    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__profile')
      .click()

    cy.get('#input_firstname')
      .should('have.value', this.admin.firstName)

    cy.get('#input_password')
      .type('1234')

    cy.get('#input_password_repeat')
      .type('1234')

    cy.get('form .btn-primary')
      .click()

    cy.contains('.alert-success', 'Profile update successful')

    cy.get('.navigation__user')
      .click()

    cy.get('.navigation__user .navigation__logout')
      .click()

    cy.login(this.admin.email, '1234')
  })
})