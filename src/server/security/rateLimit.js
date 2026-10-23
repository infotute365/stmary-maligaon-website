import { createHash } from 'node:crypto'
import RateLimit from '../models/RateLimit.js'

// Shared MongoDB counters survive restarts and multiple app instances.
export async function consumeLimit(key, limit, windowMs, now = Date.now()) {
  const window = Math.floor(now / windowMs)
  const _id = createHash('sha256').update(`${key}:${window}`).digest('hex')
  const expiresAt = new Date((window + 1) * windowMs)
  let entry
  try {
    entry = await RateLimit.findOneAndUpdate({ _id }, { $inc: { count: 1 }, $setOnInsert: { expiresAt } }, { upsert: true, new: true })
  } catch (error) {
    if (error.code !== 11000) throw error
    entry = await RateLimit.findOneAndUpdate({ _id }, { $inc: { count: 1 } }, { new: true })
  }
  return { allowed: entry.count <= limit, retryAfter: Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)) }
}
export function clientKey(request) {
  // Enable only if the ingress strips/replaces this header and blocks direct access.
  if (process.env.TRUST_PROXY_IP === 'true') return (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim().slice(0, 64)
  return 'shared'
}
