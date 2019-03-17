describe('Client', () => {

  beforeEach(() => {
    cy.fixture('users/register').as('register')
    cy.exec('npm run seed')
  })

  it('Edit client', () => {
    // cy.login(this.admin.email, this.admin.password)
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