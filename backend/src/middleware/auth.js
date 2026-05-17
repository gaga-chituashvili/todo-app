import { verifyAccessToken } from '../utils/jwt.js'

export function authenticate(req, res, next) {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Authentication required' })
  try {
    const payload = verifyAccessToken(token)
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
