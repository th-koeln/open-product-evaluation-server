describe('Survey', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.fixture('survey').as('survey')
    cy.exec('npm run seed')
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
})