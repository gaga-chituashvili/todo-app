import request from 'supertest'
import { app } from '../index.js'
import { prisma } from '../config/db.js'

const userA = { name: 'User A', email: `usera_${Date.now()}@test.com`, password: 'password123' }
const userB = { name: 'User B', email: `userb_${Date.now()}@test.com`, password: 'password123' }

let tokenA, tokenB, todoId

beforeAll(async () => {
  const resA = await request(app).post('/api/auth/register').send(userA)
  tokenA = resA.body.accessToken

  const resB = await request(app).post('/api/auth/register').send(userB)
  tokenB = resB.body.accessToken
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: [userA.email, userB.email] } } })
  await prisma.$disconnect()
})

describe('Todos', () => {
  test('POST /api/todos — create todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Test Todo', priority: 'HIGH', status: 'PENDING' })
    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Test Todo')
    todoId = res.body.id
  })

  test('POST /api/todos — missing title', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ priority: 'HIGH' })
    expect(res.status).toBe(400)
  })

  test('GET /api/todos — fetch own todos', async () => {
    const res = await request(app).get('/api/todos').set('Authorization', `Bearer ${tokenA}`)
    expect(res.status).toBe(200)
    expect(res.body.todos.length).toBeGreaterThan(0)
    expect(res.body.todos.every(t => t.title !== undefined)).toBe(true)
  })

  test('GET /api/todos — filter by status', async () => {
    const res = await request(app).get('/api/todos?status=PENDING').set('Authorization', `Bearer ${tokenA}`)
    expect(res.status).toBe(200)
    expect(res.body.todos.every(t => t.status === 'PENDING')).toBe(true)
  })

  test('GET /api/todos/:id — get own todo', async () => {
    const res = await request(app).get(`/api/todos/${todoId}`).set('Authorization', `Bearer ${tokenA}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(todoId)
  })

  test('GET /api/todos/:id — userB cannot access userA todo', async () => {
    const res = await request(app).get(`/api/todos/${todoId}`).set('Authorization', `Bearer ${tokenB}`)
    expect(res.status).toBe(404)
  })

  test('PATCH /api/todos/:id — update todo', async () => {
    const res = await request(app)
      .patch(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ status: 'COMPLETED' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('COMPLETED')
  })

  test('PATCH /api/todos/:id — userB cannot update userA todo', async () => {
    const res = await request(app)
      .patch(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ status: 'COMPLETED' })
    expect(res.status).toBe(404)
  })

  test('DELETE /api/todos/:id — userB cannot delete userA todo', async () => {
    const res = await request(app).delete(`/api/todos/${todoId}`).set('Authorization', `Bearer ${tokenB}`)
    expect(res.status).toBe(404)
  })

  test('DELETE /api/todos/:id — delete own todo', async () => {
    const res = await request(app).delete(`/api/todos/${todoId}`).set('Authorization', `Bearer ${tokenA}`)
    expect(res.status).toBe(204)
  })
})
