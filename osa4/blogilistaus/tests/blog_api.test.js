const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
const userData = {}

beforeAll(async () => {
  var { savedUser, bearerToken } = await helper.createUser()
  userData.user = savedUser
  userData.token = bearerToken
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await helper.initBlogs(userData.user._id)
})

describe('PUT method', () => {
  test('should edit a blog succesfully', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToEdit = { ...blogsBefore[0], likes: 123 }

    const response = await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .set('Authorization', userData.token)
      .send(blogToEdit)
      .expect(200)

    expect(response.body.likes).toBe(123)
    const blogsAfter = await helper.blogsInDb()

    const likes = blogsAfter.map((blog) => blog.likes)
    expect(likes).toContain(123)
  })
})

describe('DELETE method', () => {
  test('should delete a blog', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToDelete = blogsBefore[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', userData.token)
      .expect(204)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(helper.listWithManyBlogs.length - 1)

    const contents = blogsAfter.map((r) => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('POST method', () => {
  test('adds a valid blog to db', async () => {
    const newBlog = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl',
      likes: 123,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', userData.token)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.listWithManyBlogs.length + 1)
  })

  test('with missing likes field defaults to 0', async () => {
    const newBlog = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', userData.token)
      .expect(201)
      .expect('Content-type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('with missing title or url fails with 400 Bad Request', async () => {
    const newBlog1 = {
      author: 'testAuthor',
      url: 'testUrl',
      likes: 123,
    }

    const newBlog2 = {
      author: 'testAuthor',
      title: 'testTitle',
      likes: 123,
    }

    await api.post('/api/blogs').send(newBlog1).expect(400)
    await api.post('/api/blogs').send(newBlog2).expect(400)
  })
})

describe('GET method', () => {
  test('returns in json format', async () => {
    api
      .get('/api/blogs')
      .set('Authorization', userData.token)
      .expect(200)
      .expect('Content-type', /application\/json/)
  })

  test('returns all blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', userData.token)

    expect(response.body).toHaveLength(helper.listWithManyBlogs.length)
  })

  test('returns objects with id field', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', userData.token)

    response.body.forEach((elem) => {
      expect(elem['id']).toBeDefined()
    })
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
