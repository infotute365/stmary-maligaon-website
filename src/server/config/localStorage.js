import fs from 'fs/promises'
import path from 'path'


export function resolveUploadPath(filePath) {
  const uploadsRoot = path.resolve(process.cwd(), 'uploads')
  const normalized = filePath.replace(/\\/g, '/').replace(/^\/+/, '').replace(/^uploads\//, '')
  const resolved = path.resolve(uploadsRoot, normalized)

  if (resolved !== uploadsRoot && !resolved.startsWith(`${uploadsRoot}${path.sep}`)) {
    throw new Error('Invalid upload path')
  }

  return resolved
}

export async function writeLocalUpload(filePath, buffer, options = {}) {
  const destination = resolveUploadPath(filePath)
  await fs.mkdir(path.dirname(destination), { recursive: true })
  if (options.flag === 'wx') {
    const handle = await fs.open(destination, 'wx', options.mode)
    try {
      options.onCreated?.()
      await handle.writeFile(buffer)
      await handle.sync()
    } finally { await handle.close() }
    return
  }
  await fs.writeFile(destination, buffer, options)
}

export async function removeLocalUpload(filePath) {
  await fs.rm(resolveUploadPath(filePath), { force: true })
}
