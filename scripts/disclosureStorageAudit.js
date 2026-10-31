// Operator-only reconciliation. Defaults to a read-only count; never touches originals.
import { loadEnvConfig } from '@next/env'
import mongoose from 'mongoose'
import connectDB from '../src/server/config/database.js'
import { pruneDisclosureOrphans } from '../src/server/controllers/disclosureDocumentController.js'

if (process.argv.slice(2).some(argument => argument !== '--apply')) throw new Error('Only --apply is supported; omit it for a dry run.')
loadEnvConfig(process.cwd())
try {
  await connectDB()
  console.log(JSON.stringify(await pruneDisclosureOrphans({ dryRun: !process.argv.includes('--apply') })))
} catch (error) {
  console.error('Disclosure storage review failed:', error.name, error.code || '')
  process.exitCode = 1
} finally { await mongoose.disconnect() }
