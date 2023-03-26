describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000')
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'testUser',
      name: 'test',
      password: 'test',
    }
    const user2 = {
      username: 'testUser2',
      name: 'test2',
      password: 'test2',
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.request('POST', 'http://localhost:3003/api/users', user2)
  })

  it('Login form is shown', function () {
    cy.contains('Log in')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username-input').type('testUser')
      cy.get('#password-input').type('test')
      cy.get('#login-button').click()
      cy.contains('test logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username-input').type('wrong')
      cy.get('#password-input').type('user')
      cy.get('#login-button').click()
      cy.contains('invalid username or password')
      cy.contains('Log in')
    })

    describe('When logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'testUser', password: 'test' })
      })

      it('A blog can be created', function () {
        cy.get('#togglable-button').click()
        cy.get('#title-input').type('Fun stuff')
        cy.get('#author-input').type('John Doe')
        cy.get('#url-input').type('www.johndoe.com')

        cy.get('#submit-button').click()
        cy.contains('Fun stuff John Doe')
      })
    })

    describe('When logged in and created a blog', function () {
      beforeEach(function () {
        cy.login({ username: 'testUser', password: 'test' })
        cy.createBlog({
          title: 'Fun stuff',
          author: 'John Doe',
          url: 'www.johndoe.com',
        })
      })

      it('giving a like to a blog works correctly', function () {
        cy.get('#view-button').click()
        cy.get('#like-button').click()
        cy.contains('likes: 1')
      })

      it('only logged in user sees the remove button', function () {
        cy.get('#view-button').click()
        cy.contains('remove')
        cy.contains('logout').click()

        cy.login({
          username: 'testUser2',
          name: 'test2',
          password: 'test2',
        })
        cy.get('#view-button').click()
        cy.get('.blog').should('not.contain', '#remove-button')
      })

      it('blogs are sorted by likes correctly', function () {
        cy.createBlog({
          title: 'More stuff',
          author: 'Someone else',
          url: 'www.someoneelse.com',
        })

        // give one like to the first one and two for the second one
        cy.get('#view-button').click()
        cy.get('#view-button:last').click()
        cy.get('.blog').eq(0).as('firstBlog')
        cy.get('.blog').eq(1).as('secondBlog')

        cy.get('@firstBlog').contains('like').click()
        cy.get('@firstBlog').contains('likes: 1')
        cy.get('@secondBlog').contains('like').click()
        cy.get('@secondBlog').contains('like').click()

        cy.get('.blog').eq(0).contains('More stuff Someone else')
      })
    })
  })
})
