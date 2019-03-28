describe('Domain', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.fixture('domain').as('domain')
    cy.fixture('clients').as('clients')
    cy.fixture('users/user').as('user')
    cy.exec('npm run seed')
  })

  it('Admin: Should display correct number of domains', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid .card')
      .its('length')
      .should('eq', 2)
  })

  it('User: Should display correct number of domains', function() {
    cy.login(this.user.email, this.user.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid .card')
      .its('length')
      .should('eq', 1)
  })

  it('Should make domain private', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()

    cy.get('#input_name')
      .should('not.have.value', '')

    cy.get('.domain__state button')
      .click()

    cy.get('.domain__state .dropdown-menu')
      .should('be.visible')

    cy.get('.domain__state .dropdown-item:last-child')
      .click()

    cy.get('form > button.btn-primary')
      .click()
      .wait(500)
      .get('.badge.badge-secondary')
      .its('length')
      .should('eq', 2)
    
    cy.contains('.alert-success', 'Domain update successful')
  })

  it('Should make domain public', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:last-child .card-links .btn-link:first-child')
      .click()

    cy.get('#input_name')
      .should('not.have.value', '')

    cy.get('.domain__state button')
      .click()

    cy.get('.domain__state .dropdown-menu')
      .should('be.visible')

    cy.get('.domain__state .dropdown-item:first-child')
      .click()

    cy.get('form > button.btn-primary')
      .click()
      .wait(500)

    cy.contains('.alert-success', 'Domain update successful')

    cy.get('.badge-primary')
      .its('length')
      .should('eq', 2)
  })

  it('Should create domain', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.list-options > div:first-child .btn-primary')
      .click()

    cy.get('#input_name')
      .type('This is a new domain')

    cy.get('.btn-primary')
      .click()

    cy.get('.domains__grid .card')
      .its('length')
      .should('eq', 3)
  })

  it('Should edit domain', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()

    cy.get('#input_name')
      .should('not.have.value', '')
      .clear()
      .type('renamed domain')

    cy.get('form > button.btn-primary')
      .click()

    cy.contains('.alert-success', 'Domain update successful')

    cy.get('.domains__grid .card:first-child')
      .contains('.card-title', 'renamed domain')
  })

  it('Should delete domain', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:first-child .card-links > button')
      .click()
    
    cy.get(`#modal-grid-${this.domain[1].id} .modal-content`)
      .should('be.visible')
      .get(`#modal-grid-${this.domain[1].id} .btn-primary`)
      .click()
      .get('.domains__grid')
      .its('length')
      .should('eq', 1)
  })

  it('Should search domains', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type(this.domain[0].name)

    cy.get('.domains__grid .card')
      .its('length')
      .should('eq', 1)

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type(this.domain[0].name.substring(0, 4))

    cy.get('.domains__grid .card')
      .its('length')
      .should('eq', 1)

    cy.get('.search-form input.sbx-custom__input')
      .clear()

    cy.get('.domains__grid .card')
      .its('length')
      .should('eq', 2)
  })


  it('Should display empty list when no domain is found', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type('you cant find me :)')

    cy.contains('.empty__headline', 'No results')
  })

  it('Should show empty list when no domain exists', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:first-child .card-links > button')
      .click()
    
    cy.get(`#modal-grid-${this.domain[1].id} .modal-content`)
      .should('be.visible')
      .get(`#modal-grid-${this.domain[1].id} .btn-primary`)
      .click()

    cy.get('.domains__grid > .card:first-child .card-links > button')
      .should('be.visible')
      .click()

    cy.get(`#modal-grid-${this.domain[0].id} .modal-content`)
      .should('be.visible')
      .get(`#modal-grid-${this.domain[0].id} .btn-primary`)
      .click()

    cy.contains('.empty__headline', 'No domains yet')
  })

  it('Should add owner to domain', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()

    cy.get('#input_name')
      .should('not.have.value', '')

    cy.get('#input_email')
      .type(this.admin.email)

    cy.get('.domain__add-owner .btn')
      .click()

    cy.wait(500)
      .get('.owner-list .list-group-item')
      .its('length')
      .should('eq', 2)

    cy.get('form > button.btn-primary')
      .click()

    cy.contains('.alert-success', 'Domain update successful')

    cy.contains('.domains__grid > .card:first-child .domain__meta .col-6:last-child p', '2 Owner')
  })

  it('Should delete owner from domain', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()

    cy.get('#input_name')
      .should('not.have.value', '')

    cy.get('#input_email')
      .type(this.admin.email)

    cy.get('.domain__add-owner .btn')
      .click()

    cy.wait(500)
      .get('.owner-list .list-group-item')
      .its('length')
      .should('eq', 2)

    cy.get('form > button.btn-primary')
      .click()

    cy.contains('.alert-success', 'Domain update successful')

    cy.contains('.domains__grid > .card:first-child .domain__meta .col-6:last-child p', '2 Owner')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()

    cy.get('#input_name')
      .should('not.have.value', '')

    cy.get('.owner-list .list-group-item:last-child a')
      .click()

    cy.wait(500)
      .get('.owner-list .list-group-item')
      .its('length')
      .should('eq', 1)

    cy.contains('.list-group-item', this.admin.firstName + ' ' + this.admin.lastName)

    cy.get('form > button.btn-primary')
      .click()

    cy.contains('.alert-success', 'Domain update successful')

    cy.contains('.domains__grid > .card:first-child .domain__meta .col-6:last-child p', '1 Owner')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()

    cy.contains('.list-group-item', this.admin.firstName + ' ' + this.admin.lastName)

    cy.wait(500)
      .get('.owner-list .list-group-item')
      .its('length')
      .should('eq', 1)
  })

  it('Should add client to domain', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()

    cy.get('#input_name')
      .should('not.have.value', '')

    cy.get('#input_client input')
      .type(this.clients[0].name)

    cy.get('.domain__add-client .btn-secondary')
      .click()

    cy.wait(500)
      .get('.client-list .list-group-item')
      .its('length')
      .should('eq', 3)

    cy.get('#input_client input')
      .type(this.clients[0].name)

    cy.get('#input_client .dropdown-menu .highlight a')
      .click()

    
    cy.get('.domain__add-client .btn-secondary')
      .click()

    cy.wait(500)
      .get('.client-list .list-group-item')
      .its('length')
      .should('eq', 4)
    
    cy.contains('.client-list .list-group-item', this.clients[0].name)

    cy.get('form > button.btn-primary')
      .click()

    cy.contains('.alert-success', 'Domain update successful')

    cy.contains('.domains__grid > .card:first-child .domain__meta .col-6:first-child p', '4 Clients')

    cy.contains('.domains__grid > .card:last-child .domain__meta .col-6:first-child p', '1 Clients')
  })

  it('Should remove client from domain', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()

    cy.get('#input_name')
      .should('not.have.value', '')

    cy.get('.client-list .list-group-item:first-child a')
      .click()

    cy.wait(500)
      .get('.client-list .list-group-item')
      .its('length')
      .should('eq', 2)

    cy.get('form > button.btn-primary')
      .click()

    cy.contains('.alert-success', 'Domain update successful')

    cy.contains('.domains__grid > .card:first-child .domain__meta .col-6:first-child p', '2 Clients')
  })

  it('Should change survey to no survey', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()

    cy.get('#input_name')
      .should('not.have.value', '')

    cy.get('.custom-select option')
      .its('length')
      .should('eq', 3)

    cy.get('.custom-select')
      .select('')

    cy.get('form > button.btn-primary')
      .click()

    cy.contains('p', 'No survey active')
  })

  it('Should change survey to different survey', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()

    cy.get('#input_name')
      .should('not.have.value', '')

    cy.wait(500)
      .get('.custom-select option')
      .its('length')
      .should('eq', 3)

    cy.get('.custom-select')
      .select('')

    cy.get('form > button.btn-primary')
      .click()

    cy.contains('p', 'No survey active')

    cy.get('.domains__grid > .card:first-child .card-links .btn-link:first-child')
      .click()
  })
})