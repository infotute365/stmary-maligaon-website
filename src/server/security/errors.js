export function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 })
}
export function sendError(res, error) {
  const invalid = ['ValidationError', 'CastError', 'StrictModeError'].includes(error.name)
  const status = invalid ? 400 : error.code === 11000 ? 409 : 500
  if (status === 500) console.error('Database operation failed:', error.name, error.code || '')
  return res.status(status).json({ success: false, message: invalid ? 'Invalid field value or missing required field' : status === 409 ? 'This record already exists' : 'Unable to complete request' })
}
