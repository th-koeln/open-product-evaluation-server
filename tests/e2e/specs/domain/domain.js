describe('Domain', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.fixture('domain').as('domain')
    cy.exec('npm run seed')
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
      .should('be', 3)
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
      .should('be', 1)
  })

  it('Should search domains', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type(this.domain[0].name)

    cy.get('.domains__grid .card')
      .its('length')
      .should('be', 1)

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type(this.domain[0].name.substring(0, 4))

    cy.get('.domains__grid .card')
      .its('length')
      .should('be', 1)

    cy.get('.search-form input.sbx-custom__input')
      .clear()

    cy.get('.domains__grid .card')
      .its('length')
      .should('be', 2)
  })


  it('Should display empty list when no domain is found', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/domain')

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type('you cant find me :)')

    cy.contains('.empty__headline', 'No results')
  })
})