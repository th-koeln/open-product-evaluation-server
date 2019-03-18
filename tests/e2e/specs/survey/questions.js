describe('Survey', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.fixture('surveys/existing').as('survey')
    cy.exec('npm run seed')
  })

  it.only('Should display correct number of questions', function() {
    cy.login(this.admin.email, this.admin.password)

    cy.visit('/#/survey')

    cy.visit('/#/survey')
      .get('.surveys__grid .card:first-child .survey__details')
      .click()

    cy.get('.question')
      .its('length')
      .should('eq', 6)
  })
})