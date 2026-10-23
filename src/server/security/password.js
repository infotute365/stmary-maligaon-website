export function validPassword(password) {
  return typeof password === 'string' && password.length >= 12 &&
    Buffer.byteLength(password, 'utf8') <= 72 && /[a-z]/.test(password) &&
    /[A-Z]/.test(password) && /\d/.test(password)
}
export const passwordMessage = 'Password must contain 12 or more characters, uppercase, lowercase and a number, and use at most 72 UTF-8 bytes'
export function validEmail(email) {
  return typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
export function jwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || Buffer.byteLength(secret) < 32) throw new Error('JWT_SECRET must be at least 32 bytes')
  return secret
}
