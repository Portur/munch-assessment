import * as jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
  const token = req.header('Authorization')
  if (!token) return res.status(401).json({ error: 'Access denied' })
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET!) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}