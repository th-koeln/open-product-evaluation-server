describe('Ranking Question', () => {

  beforeEach(() => {
    cy.fixture('users/admin').as('admin')
    cy.fixture('surveys/existing').as('survey')
    cy.exec('npm run seed')
  })

  it('Should change question value', function() {
    cy.activateSurvey(this.admin.email, this.admin.password)

    cy.get('.question:nth-child(6)')
      .click()

    cy.get('.question:nth-child(6) input[id^=input_value]')
      .should('not.have.value', '')
      .clear()
      .type('new value')

    cy.visitSurvey(this.survey.id)

    cy.get('.question:nth-child(6) input[id^=input_value]')
      .should('have.value', 'new value')
  })

  it('Should add item to question', function() {
    cy.activateSurvey(this.admin.email, this.admin.password)

    cy.get('.question:nth-child(6)')
      .click()

    cy.get('.question:nth-child(6) .question__new-item')
      .click()

    cy.wait(500)
      .get('.question:nth-child(6) .item__content')
      .its('length')
      .should('eq', 5)
  })

  it('Should change item value', function() {
    cy.activateSurvey(this.admin.email, this.admin.password)

    cy.get('.question:nth-child(6)')
      .click()

    cy.get('.question:nth-child(6) .item:last-child input[id^=item_label]')
      .should('not.have.value', '')
      .clear()
      .type('new value')

    cy.visitSurvey(this.survey.id)

    cy.get('.question:nth-child(6) .item:last-child input[id^=item_label]')
      .should('have.value', 'new value')
  })

  it('Should delete item from question', function() {
    cy.activateSurvey(this.admin.email, this.admin.password)

    cy.get('.question:nth-child(6)')
      .click()

    cy.get('.question:nth-child(6) .question__new-item')
      .click()
      .wait(500)
      .get('.question:nth-child(6) .item__content')
      .its('length')
      .should('eq', 5)

    cy.get('.question:nth-child(6) .item:last-child .item__delete')
      .click()

    cy.wait(500)
      .get('.question:nth-child(6) .item__content')
      .its('length')
      .should('eq', 4)
  })

  it('Should move up question', function() {
    cy.activateSurvey(this.admin.email, this.admin.password)

    cy.get('.question:nth-child(6) input[id^=input_value]')
      .clear()
      .type('moving up...')

    cy.get('.question:nth-child(6) .question__up')
      .click()

    cy.get('.question:nth-child(5) input[id^=input_value]')
      .should('have.value', 'moving up...')
      .clear()
      .type('moving down...')

    cy.get('.question:nth-child(5) .question__down')
      .click()

    cy.get('.question:nth-child(6) input[id^=input_value]')
      .should('have.value', 'moving down...')
  })

  it('Should append new question', function() {
    cy.activateSurvey(this.admin.email, this.admin.password)

    cy.get('.question:nth-child(6)')
      .click()

    cy.get('.question:nth-child(6) .question__append')
      .click()

    cy.wait(500)
      .get('.question')
      .its('length')
      .should('eq', 7)
  })
})