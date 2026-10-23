import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Admin from '../models/Admin.js'
import { validEmail, validPassword, passwordMessage, jwtSecret } from '../security/password.js'

const cookie = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' })
// Equal-cost work for unknown accounts reduces account enumeration by timing.
const dummyHash = bcrypt.hashSync('DummyPassword-123-do-not-use', 12)
export const login = async (req, res) => {
  const { email, password } = req.body
  if (!validEmail(email) || typeof password !== 'string' || !password || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ success: false, message: 'Invalid email or password format' })
  }
  const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).select('+password')
  const matched = await bcrypt.compare(password, admin?.password || dummyHash)
  if (!admin || !matched) return res.status(401).json({ success: false, message: 'Invalid credentials' })
  admin.lastLogin = new Date()
  await admin.save()
  const token = jwt.sign({ id: String(admin._id), version: admin.sessionVersion || 0 }, jwtSecret(), { algorithm: 'HS256', expiresIn: '7d' })
  res.cookie('adminToken', token, { ...cookie(), maxAge: 7 * 24 * 60 * 60 * 1000 })
  res.json({ success: true, message: 'Login successful', data: { id: admin._id, email: admin.email, name: admin.name } })
}
export const logout = async (req, res) => {
  // Revoke all sessions, including copies of a stolen token.
  await Admin.updateOne({ _id: req.admin._id }, { $inc: { sessionVersion: 1 } })
  res.clearCookie('adminToken', cookie())
  res.json({ success: true, message: 'Logged out successfully' })
}
export const checkAuth = async (req, res) => {
  res.json({ success: true, data: { _id: req.admin._id, email: req.admin.email, name: req.admin.name, lastLogin: req.admin.lastLogin } })
}
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (typeof currentPassword !== 'string' || Buffer.byteLength(currentPassword) > 72 || !validPassword(newPassword)) {
    return res.status(400).json({ success: false, message: passwordMessage })
  }
  const admin = await Admin.findById(req.admin._id).select('+password')
  if (!admin || !(await admin.comparePassword(currentPassword))) return res.status(401).json({ success: false, message: 'Current password is incorrect' })
  admin.password = newPassword
  await admin.save()
  res.clearCookie('adminToken', cookie())
  res.json({ success: true, message: 'Password changed successfully. Please sign in again.' })
}
