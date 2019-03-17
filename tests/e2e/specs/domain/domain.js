describe('Domain', () => {

  beforeEach(() => {
    cy.fixture('users/register').as('register')
    cy.exec('npm run seed')
    cy.login(this.admin.email, this.admin.password)
  })

  it('Create Domain', () => {

  })

  it('Edit Domain', () => {

  })

  it('Delete Domain', () => {

  })

  it('Add Owner to Domain', () => {

  })

  it('Remove Owner from Domain', () => {

  })

  it('Add Client to Domain', () => {

  })

  it('Remove Client from Domain', () => {
    
  })

  it('Search Domains', () => {
    
  })
})