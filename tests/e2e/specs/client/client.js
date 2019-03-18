describe('Client', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.fixture('clients').as('clients')
    cy.fixture('users/user').as('user')
    cy.exec('npm run seed')
  })

  it('Admin: Should display correct number of clients', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/clients')

    cy.get('.client-item')
      .its('length')
      .should('eq', 4)
  })

  it('User: Should display correct number of clients', function() {
    cy.login(this.user.email, this.user.password)

    cy.visit('/#/clients')

    cy.get('.client-item')
      .its('length')
      .should('eq', 2)
  })

  it('Should edit client', function() {
    cy.login(this.admin.email, this.admin.password)
    cy.visit('/#/clients')

    cy.get('.clients__list .client-item:first-child .clients__action a:first-child')
      .click()

    cy.url()
      .should('include', 'clients/edit')

    cy.get('#input_name')
      .clear()
      .type('renamed client')
    
    cy.get('.btn-primary')
      .click()

    cy.contains('.alert-success', 'Client update successful')

    cy.get('.clients__list .client-item:first-child')
      .contains('h5', 'renamed client')
  })

  it('Should show error on empty client name', function() {
    cy.login(this.admin.email, this.admin.password)
    cy.visit('/#/clients')

    cy.get('.clients__list .client-item:first-child .clients__action a:first-child')
      .click()

    cy.url()
      .should('include', 'clients/edit')
    
    cy.get('#input_name')
      .should('not.have.value', '')
      .clear()

    cy.contains('.invalid-feedback', 'Client name is required')
  })

  it('Should delete client', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/clients')

    cy.get('.clients__list .client-item:first-child .clients__action a:last-child')
      .click()
      .get('.client-item')
      .its('length')
      .should('eq', 3)
  })

  it('Should add owner to client', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/clients')

    cy.get('.clients__list .client-item:first-child .clients__action a:first-child')
      .click()

    cy.get('#input_email')
      .type(this.admin.email)

    cy.get('#input_email + div > .btn-secondary')
      .click()

    cy.get('form .btn-primary')
      .click()

    cy.contains('p', '2 Owner')
  })

  it('Should remove owner from client', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/clients')

    cy.get('.clients__list .client-item:first-child .clients__action a:first-child')
      .click()

    cy.get('#input_email')
      .type(this.admin.email)

    cy.get('#input_email + div > .btn-secondary')
      .click()

    cy.get('form .btn-primary')
      .click()

    cy.contains('p', '2 Owner')

    cy.get('.clients__list .client-item:first-child .clients__action a:first-child')
      .click()

    cy.get('.owner-list .list-group-item:last-child a')
      .click()

    cy.wait(500)
      .get('.owner-list .list-group-item')
      .its('length')
      .should('eq', 1)
  })

  it('Should show warning if new owner doesnt exist', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/clients')

    cy.get('.clients__list .client-item:first-child .clients__action a:first-child')
      .click()

    cy.get('#input_email')
      .type('this is a random email or not')

    cy.get('#input_email + div > .btn-secondary')
      .click()

    cy.contains('.alert-warning', 'No User found.')
  })

  it('Should search clients', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/clients')

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type(this.clients[0].name)

    cy.get('.client-item')
      .its('length')
      .should('eq', 1)

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type(this.clients[0].name.substring(0, 4))

    cy.get('.client-item')
      .its('length')
      .should('eq', 2)

    cy.get('.search-form input.sbx-custom__input')
      .clear()

    cy.get('.client-item')
      .its('length')
      .should('eq', 4)
  })

  it('Should display empty list when no client is found', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/clients')

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type('you cant find me :)')

    cy.contains('.empty__headline', 'No results')
  })
})