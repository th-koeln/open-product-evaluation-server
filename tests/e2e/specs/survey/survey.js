describe('Survey', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.fixture('users/user').as('user')
    cy.fixture('surveys/new').as('survey')
    cy.exec('npm run seed')
  })

  it('Admin: Should display correct number of surveys', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/survey')

    cy.get('.surveys__grid .card')
      .its('length')
      .should('eq', 2)
  })

  it('User: Should display correct number of surveys', function() {
    cy.login(this.user.email, this.user.password)

    cy.visit('/#/survey')

    cy.get('.surveys__grid .card')
      .its('length')
      .should('eq', 1)
  })

  it('Should disable input when survey is disabled', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/survey')

    cy.visit('/#/survey')
      .get('.surveys__grid .card:first-child .survey__details')
      .click()

    cy.contains('.alert-warning', 'You can only edit inactive surveys.')

    cy.get('#input_title')
      .should('be.disabled')

    cy.get('#input_description')
      .should('be.disabled')
  })

  it('Should create survey', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/survey')
      .get('.list-options > div:first-child .btn-primary')
      .click()

    cy.url()
      .should('include', 'survey/new')

    cy.get('#input_title')
      .type(this.survey.title)

    cy.get('#input_description')
      .type(this.survey.description)

    cy.get('form .btn-primary')
      .click()

    cy.contains('.empty__headline', 'There are no questions')
  })

  it('Should delete survey', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/survey')
      .get('.surveys__grid .card:first-child .survey__delete')
      .click()
    
    cy.get('.surveys__grid > .card:first-child .card-links .modal .btn-primary')
      .click()

    cy.get('.surveys__grid .card')
      .its('length')
      .should('eq', 1)
  })

  it('Should search surveys', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/survey')

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type('Technisch')

    cy.get('.surveys__grid .card')
      .its('length')
      .should('eq', 1)

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type('Konsum')

    cy.get('.surveys__grid .card')
      .its('length')
      .should('eq', 1)

    cy.get('.search-form input.sbx-custom__input')
      .clear()

    cy.get('.surveys__grid .card')
      .its('length')
      .should('eq', 2)
  })

  it('Should display empty list when no survey is found', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/survey')

    cy.get('.search-form input.sbx-custom__input')
      .clear()
      .type('you cant find me :)')

    cy.contains('.empty__headline', 'No results')
  })

  it('Should show empty list when no survey exists', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/survey')

    cy.visit('/#/survey')
      .get('.surveys__grid .card:first-child .survey__delete')
      .click()
    
    cy.get('.surveys__grid > .card:first-child .card-links .modal .btn-primary')
      .click()

    cy.visit('/#/survey')
      .get('.surveys__grid .card:first-child .survey__delete')
      .click()
    
    cy.get('.surveys__grid > .card:first-child .card-links .modal .btn-primary')
      .click()

    cy.contains('.empty__headline', 'Add some surveys')
  })
})