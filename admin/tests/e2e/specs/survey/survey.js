describe('Survey', () => {

  beforeEach(() => {
    cy.exec('npm run seed')
    cy.login('jane@doe.com', 'password')
  })

  it('Create Survey', () => {

    cy.get('.btn-primary')
      .click()

    cy.url()
      .should('contain', '/survey/new')

    cy.get('#input_title')
      .type('test survey')

    cy.get('#input_description')
      .type('Dies ist eine Test Survey!')

    cy.get('.btn-primary')
      .click()

    cy.get('.container div')
      .should('have.class', 'survey')
  })

  it('change title', () => {
    cy.get('.card:last-child > .card-body > .card-links > a:first-child')
      .click()

    cy.get('#input_title')
      .type(' not{enter}')

    cy.visit('/#/survey')

    cy.get('.card:last-child > .card-body > .card-links > a:first-child')
      .click()

    cy.get('#input_title')
      .should('have.value', 'test survey not')

  })
})