import bcrypt from 'bcryptjs'
import { prisma } from '../config/db.js'
import { generateTokens, setTokenCookies, verifyRefreshToken } from '../utils/jwt.js'
import { registerSchema, loginSchema } from '../validators/auth.validator.js'

export async function register(req, res) {
  const result = registerSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors })
  }

  const { name, email, password } = result.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: 'Email already registered' })

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  const { accessToken, refreshToken } = generateTokens(user.id)
  setTokenCookies(res, accessToken, refreshToken)

  res.status(201).json({ user, accessToken })
}

export async function login(req, res) {
  const result = loginSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors })
  }

  const { email, password } = result.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const { accessToken, refreshToken } = generateTokens(user.id)
  setTokenCookies(res, accessToken, refreshToken)

  res.json({
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    accessToken,
  })
}

export function logout(req, res) {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out successfully' })
}

export async function refresh(req, res) {
  const token = req.cookies?.refreshToken
  if (!token) return res.status(401).json({ error: 'Refresh token required' })
  try {
    const payload = verifyRefreshToken(token)
    const { accessToken, refreshToken } = generateTokens(payload.userId)
    setTokenCookies(res, accessToken, refreshToken)
    res.json({ accessToken })
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
}

export async function getMe(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, createdAt: true, _count: { select: { todos: true } } },
  })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
}

export async function updateMe(req, res) {
  const { name } = req.body
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' })
  }
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  res.json(user)
}
