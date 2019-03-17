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
})