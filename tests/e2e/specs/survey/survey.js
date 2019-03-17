describe('Survey', () => {

  beforeEach(() => {
    cy.fixture('users/register').as('register')
    cy.exec('npm run seed')
    cy.login(this.admin.email, this.admin.password)
  })

  it('Create Survey', () => {

  })
})