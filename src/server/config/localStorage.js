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

export async function writeLocalUpload(filePath, buffer) {
  const destination = resolveUploadPath(filePath)
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.writeFile(destination, buffer)
}

export async function removeLocalUpload(filePath) {
  await fs.rm(resolveUploadPath(filePath), { force: true })
}