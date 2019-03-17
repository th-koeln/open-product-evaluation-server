describe('Survey', () => {

  beforeEach(() => {
    cy.fixture('users/register').as('register')
    cy.exec('npm run seed')
  })

  it('Create Survey', () => {
    // cy.login(this.admin.email, this.admin.password)
  })
})