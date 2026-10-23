import { registerHooks } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
const root = fileURLToPath(new URL('../', import.meta.url))
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) specifier = pathToFileURL(path.join(root, 'src', specifier.slice(2))).href
  if (specifier === 'next/server') specifier = 'next/server.js'
  return nextResolve(specifier, context)
} })
