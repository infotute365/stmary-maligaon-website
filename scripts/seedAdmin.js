import nextEnv from '@next/env'
import mongoose from 'mongoose'
import { createInterface } from 'node:readline/promises'
import { Writable } from 'node:stream'
import { pathToFileURL } from 'node:url'
import connectDB from '../src/server/config/database.js'
import Admin from '../src/server/models/Admin.js'
import RateLimit from '../src/server/models/RateLimit.js'
import { validEmail, validPassword, passwordMessage } from '../src/server/security/password.js'

export async function seedAdmin({ email, password, name = 'Super Admin' }, { reset = false } = {}) {
  if (!validEmail(email)) throw new Error('Enter a valid email address')
  if (!validPassword(password)) throw new Error(passwordMessage)
  if (typeof name !== 'string' || !name.trim() || name.length > 100) throw new Error('Enter a name of 1–100 characters')
  email = email.trim().toLowerCase()
  await connectDB()
  await Admin.init() // Enforce the unique email index before creating anything.
  await RateLimit.init() // Create the shared limiter TTL index during setup.
  const existing = await Admin.findOne({ email }).select('+password')
  if (existing) {
    if (!reset) return 'Admin already exists. No changes made. Use npm run seed:admin:reset only to replace its password.'
    existing.password = password
    await existing.save() // Hashes password and revokes existing sessions.
    return 'Admin password reset. Existing sessions have been revoked.'
  }
  if (reset) throw new Error('Admin not found. Use npm run seed:admin to create the account.')
  await Admin.create({ email, password, name: name.trim() })
  return 'Admin created. Password stored as a bcrypt hash.'
}

async function main() {
  nextEnv.loadEnvConfig(process.cwd())
  let credentials
  if (process.argv.includes('--stdin-json')) {
    let text = ''
    for await (const chunk of process.stdin) {
      text += chunk
      if (Buffer.byteLength(text) > 4096) throw new Error('Seed input is too large')
    }
    credentials = JSON.parse(text)
  } else {
    if (!process.stdin.isTTY) throw new Error('Run in an interactive terminal or pass --stdin-json with a secure stdin source')
    let muted = false
    const output = new Writable({ write(chunk, encoding, callback) { if (!muted) process.stdout.write(chunk, encoding); callback() } })
    const rl = createInterface({ input: process.stdin, output, terminal: true })
    try {
      const email = await rl.question('Admin email: ')
      const name = await rl.question('Admin name (Enter for Super Admin): ')
      const readPassword = async prompt => {
        const pending = rl.question(prompt)
        muted = true
        try { return await pending } finally { muted = false; process.stdout.write('\n') }
      }
      const password = await readPassword('Admin password (hidden): ')
      const confirm = await readPassword('Confirm password (hidden): ')
      if (password !== confirm) throw new Error('Passwords do not match')
      credentials = { email, password, name: name || 'Super Admin' }
    } finally { rl.close() }
  }
  console.log(await seedAdmin(credentials, { reset: process.argv.includes('--reset') }))
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    // Never dump credentials, URIs, DB validation payloads or stack traces.
    console.error(['MongoServerError', 'MongoServerSelectionError', 'MongooseError', 'ValidationError', 'SyntaxError', 'TypeError'].includes(error.name) ? 'Seed failed. Check database connectivity, permissions and indexes.' : error.message)
    process.exitCode = 1
  }).finally(() => mongoose.disconnect())
}
