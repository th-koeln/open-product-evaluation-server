describe('User', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.fixture('users/user').as('user')
    cy.exec('npm run seed')
  })

  it('Admin: Should display correct number of users', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/user')

    cy.get('.user__item')
      .its('length')
      .should('eq', 3)
  })

  it('Admin: Should have user page in page navigation', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.get('.navbar .navbar-nav:first-child > .nav-item a')
      .its('length')
      .should('eq', 4)
  })

  it('User: Should not have user page in page navigation', function() {
    cy.login(this.user.email, this.user.password)

    cy.get('.navbar .navbar-nav:first-child > .nav-item a')
      .its('length')
      .should('eq', 3)
  })

  it('Should edit user', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/user')

    cy.get('.users__list .user__item:first-child .user__action a')
      .click()
    
    cy.get('#input_email')
      .clear()
      .type(this.admin.email + 'm')
    
    cy.get('.btn-primary')
      .click()

    cy.url()
      .should('include', '/user')

    cy.contains('.alert-success', 'User update successful')
  })

  it('Should downgrade user role', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/user')

    cy.get('.user__item:nth-child(2) .user__action a')
      .click()

    cy.url()
      .should('include', 'user/edit')

    cy.get('#input_role')
      .select('User')
    
    cy.get('form .btn-primary')
      .click()
    
    cy.contains('.alert-success', 'User update successful')
    
    cy.contains('.user__item:first-child h5', 'Jake Doe')
    
    cy.get('.user__item:first-child .user__action a')
      .click()

    cy.get('#input_role')
      .should('have.value', 'false')
  })

  it('Should upgrade user role', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/user')

    cy.get('.user__item:last-child .user__action a')
      .click()

    cy.url()
      .should('include', 'user/edit')

    cy.get('#input_role')
      .select('Administrator')
      .should('have.value', 'true')

    cy.get('form .btn-primary')
      .click()

    cy.contains('.alert-success', 'User update successful')
    cy.contains('.user__item:first-child h5', 'John Doe')
    cy.get('.user__item:first-child .user__action a')
      .click()

    cy.get('#input_role')
      .should('have.value', 'true')
  })

  it('Should search user', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/user')

    cy.get('.search-form input.form-control')
      .clear()
      .type(this.admin.firstName)

    cy.get('.user__item')
      .its('length')
      .should('eq', 1)

    cy.get('.search-form input.form-control')
      .clear()
      .type(this.admin.firstName.substring(0, 2))

    cy.get('.user__item')
      .its('length')
      .should('eq', 2)

    cy.get('.search-form input.form-control')
      .clear()

    cy.get('.user__item')
      .its('length')
      .should('eq', 3)
  })

  it('Should display empty list when no user is found', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/user')

    cy.get('.search-form input.form-control')
      .clear()
      .type('you cant find me :)')

    cy.contains('.empty__headline', 'No results')
  })
})