describe('Client', () => {

  beforeEach(() => {
    cy.fixture('users/register').as('register')
    cy.exec('npm run seed')
    cy.login(this.admin.email, this.admin.password)
  })

  it('Edit client', () => {

  })

  it('Delete client', () => {

  })

  it('Add Owner to Client', () => {

  })

  it('Remove Owner from Client', () => {
    
  })

  it('Search Clients', () => {
    
  })
})