describe('Client', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.fixture('clients').as('clients')
    cy.exec('npm run seed')
  })

  it('Should edit first client in client list', function() {
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

  it('Should delete first client in client list', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/clients')

    cy.get('.clients__list .client-item:first-child .clients__action a:last-child')
      .click()

    cy.get('.client-item')
      .its('length')
      .should('be', 3)
  })


  it('Should search Clients', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/clients')

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type(this.clients[0].name)

    cy.get('.client-item')
      .its('length')
      .should('be', 1)

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type(this.clients[0].name.substring(0, 4))

    cy.get('.client-item')
      .its('length')
      .should('be', 2)

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .should('be', 4)
  })


  it('Should display no results when no client is found', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/clients')

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type('you cant find me :)')

    cy.contains('.empty__headline', 'No results')
  })
})