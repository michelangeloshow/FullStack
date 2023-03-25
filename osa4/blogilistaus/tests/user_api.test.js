const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('db inited with one user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const saltRounds = 10
    const passwordHash = await bcrypt.hash('salasana', saltRounds)

    const user = new User({
      username: 'michel',
      name: 'Michel Leermakers',
      passwordHash: passwordHash,
    })

    await user.save()
  })

  test('creation fails with duplicate/too short username', async () => {
    const usersBefore = await helper.usersInDb()

    const user1 = {
      username: 'michel',
      name: 'Pekka Pouta',
      password: '123',
    }
    const user2 = {
      username: 'mi',
      name: 'Pekka Pouta',
      password: '123',
    }

    const response1 = await api.post('/api/users').send(user1).expect(400)

    expect(response1.body.error).toBe(
      'User validation failed: username: Error, expected `username` to be unique. Value: `michel`'
    )

    const response2 = await api.post('/api/users').send(user2).expect(400)

    expect(response2.body.error).toBe(
      'User validation failed: username: Path `username` (`mi`) is shorter than the minimum allowed length (3).'
    )

    const usersAfter = await helper.usersInDb()

    expect(usersAfter.length).toBe(usersBefore.length)
  })

  test('creation fails with too short password', async () => {
    const usersBefore = await helper.usersInDb()
    const user = {
      username: 'pekka',
      name: 'pouta',
      password: '12',
    }

    const response = await api.post('/api/users').send(user).expect(400)

    expect(response.body.error).toBe('password must be at least 3 long')

    const usersAfter = await helper.usersInDb()

    expect(usersAfter.length).toBe(usersBefore.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
