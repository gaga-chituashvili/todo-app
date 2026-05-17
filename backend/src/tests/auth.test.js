import request from 'supertest'
import { app } from '../index.js'
import { prisma } from '../config/db.js'

const testUser = {
  name: 'Test User',
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
}

let accessToken

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } })
  await prisma.$disconnect()
})

describe('Auth', () => {
  test('POST /api/auth/register — success', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser)
    expect(res.status).toBe(201)
    expect(res.body.user.email).toBe(testUser.email)
    expect(res.body.accessToken).toBeDefined()
    accessToken = res.body.accessToken
  })

  test('POST /api/auth/register — duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser)
    expect(res.status).toBe(409)
  })

  test('POST /api/auth/register — invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...testUser, email: 'notanemail' })
    expect(res.status).toBe(400)
  })

  test('POST /api/auth/login — success', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password })
    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined()
    accessToken = res.body.accessToken
  })

  test('POST /api/auth/login — wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: 'wrongpass' })
    expect(res.status).toBe(401)
  })

  test('GET /api/auth/me — authenticated', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${accessToken}`)
    expect(res.status).toBe(200)
    expect(res.body.email).toBe(testUser.email)
  })

  test('GET /api/auth/me — no token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})
