import { prisma } from '../config/db.js'
import { createTodoSchema, updateTodoSchema, todoQuerySchema } from '../validators/todo.validator.js'

export async function getTodos(req, res) {
  const result = todoQuerySchema.safeParse(req.query)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid query parameters' })
  }

  const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = result.data

  const todos = await prisma.todo.findMany({
    where: {
      userId: req.userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
    },
    orderBy: { [sortBy]: order },
  })

  res.json({ todos, total: todos.length })
}

export async function getTodo(req, res) {
  const todo = await prisma.todo.findFirst({
    where: { id: req.params.id, userId: req.userId },
  })
  if (!todo) return res.status(404).json({ error: 'Todo not found' })
  res.json(todo)
}

export async function createTodo(req, res) {
  const result = createTodoSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors })
  }

  const todo = await prisma.todo.create({
    data: {
      ...result.data,
      dueDate: result.data.dueDate ? new Date(result.data.dueDate) : null,
      userId: req.userId,
    },
  })

  res.status(201).json(todo)
}

export async function updateTodo(req, res) {
  const existing = await prisma.todo.findFirst({
    where: { id: req.params.id, userId: req.userId },
  })
  if (!existing) return res.status(404).json({ error: 'Todo not found' })

  const result = updateTodoSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors })
  }

  const todo = await prisma.todo.update({
    where: { id: req.params.id },
    data: {
      ...result.data,
      dueDate: result.data.dueDate !== undefined ? (result.data.dueDate ? new Date(result.data.dueDate) : null) : undefined,
    },
  })

  res.json(todo)
}

export async function deleteTodo(req, res) {
  const existing = await prisma.todo.findFirst({
    where: { id: req.params.id, userId: req.userId },
  })
  if (!existing) return res.status(404).json({ error: 'Todo not found' })

  await prisma.todo.delete({ where: { id: req.params.id } })
  res.status(204).send()
}

export async function getStats(req, res) {
  const [total, pending, inProgress, completed, high] = await Promise.all([
    prisma.todo.count({ where: { userId: req.userId } }),
    prisma.todo.count({ where: { userId: req.userId, status: 'PENDING' } }),
    prisma.todo.count({ where: { userId: req.userId, status: 'IN_PROGRESS' } }),
    prisma.todo.count({ where: { userId: req.userId, status: 'COMPLETED' } }),
    prisma.todo.count({ where: { userId: req.userId, priority: 'HIGH' } }),
  ])
  res.json({ total, pending, inProgress, completed, high })
}
