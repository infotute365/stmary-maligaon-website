import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import { jwtSecret } from '../security/password.js'

export const protect = async (req, res, next) => {
  const secret = jwtSecret()
  try {
    const token = req.cookies.adminToken || req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1]
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' })
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] })
    if (typeof decoded.id !== 'string' || !/^[a-f0-9]{24}$/i.test(decoded.id) || !Number.isInteger(decoded.version)) throw new Error('Invalid session')
    const admin = await Admin.findById(decoded.id).select('-password')
    if (!admin || decoded.version !== (admin.sessionVersion || 0)) throw new Error('Expired session')
    req.admin = admin
    next()
  } catch (error) {
    if (!['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name) && !['Invalid session', 'Expired session'].includes(error.message)) throw error
    res.status(401).json({ success: false, message: 'Not authenticated' })
  }
}
