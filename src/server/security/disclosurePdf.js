import { Worker } from 'node:worker_threads'
import { createRequire } from 'node:module'
import { createHash, randomUUID } from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs/promises'
import { PDFDocument } from '@cantoo/pdf-lib'
import { resolveUploadPath, writeLocalUpload } from '../config/localStorage.js'
import { badRequest } from './errors.js'
import { disclosureFilePath } from '../../content/disclosureDocuments.js'

const workerSource = String.raw`
const { parentPort, workerData } = require('node:worker_threads')
const { PDFDocument, PDFDict, PDFArray, PDFName, PDFRef, PDFStream, PDFNumber, PDFRawStream, decodePDFRawStream } = require(workerData.parserPath)
;(async () => {
  try {
    const document = await PDFDocument.load(new Uint8Array(workerData.bytes), {
      ignoreEncryption: false, throwOnInvalidObject: true, warnOnInvalidObjects: false,
      updateMetadata: false, preserveXFA: true,
    })
    if (document.isEncrypted || document.context.trailerInfo.Encrypt) throw new Error('Encrypted PDF')
    const pages = document.getPages()
    if (!pages.length || pages.length > 500) throw new Error('Invalid page count')
    const indirect = document.context.enumerateIndirectObjects()
    if (indirect.length > 50000) throw new Error('Too many PDF objects')
    const pending = indirect.map(entry => entry[1]).concat(document.catalog)
    const seen = new Set()
    const forbiddenKeys = new Set(['JavaScript','JS','OpenAction','AA','EmbeddedFiles','EF','AF','XFA','RichMediaContent','RichMediaSettings','Collection','Launch','SubmitForm','ImportData'])
    const forbiddenNames = new Set(['Action','JavaScript','Launch','SubmitForm','ImportData','GoTo','GoToR','GoToE','GoTo3DView','URI','Rendition','Movie','Sound','RichMedia','EmbeddedFile','Filespec','FileAttachment','Crypt','Named','Hide','ResetForm','SetOCGState','Trans','Thread'])
    let visited = 0, decodedBytes = 0
    while (pending.length) {
      let object = pending.pop()
      if (object instanceof PDFRef) {
        object = document.context.lookup(object)
        if (!object) throw new Error('Dangling PDF reference')
      }
      if (!object || seen.has(object)) continue
      seen.add(object)
      if (++visited > 200000) throw new Error('PDF object limit')
      if (object instanceof PDFName && forbiddenNames.has(object.decodeText())) throw new Error('Active or embedded PDF content')
      if (object instanceof PDFStream) {
        pending.push(object.dict)
        const declaredLength = document.context.lookup(object.dict.get(PDFName.of('Length')))
        if (declaredLength instanceof PDFNumber && object.getContents().length !== declaredLength.asNumber()) throw new Error('Truncated PDF stream')
        const subtype = document.context.lookup(object.dict.get(PDFName.of('Subtype')))
        if (object instanceof PDFRawStream && !(subtype instanceof PDFName && subtype.decodeText() === 'Image')) {
          const decoded = decodePDFRawStream(object).decode()
          decodedBytes += decoded.length
          if (decoded.length > 32 * 1024 * 1024 || decodedBytes > 64 * 1024 * 1024) throw new Error('Decoded PDF stream limit')
        }
      }
      if (object instanceof PDFDict) {
        for (const [key, value] of object.entries()) {
          if (forbiddenKeys.has(key.decodeText())) throw new Error('Active PDF dictionary')
          pending.push(value)
        }
      } else if (object instanceof PDFArray) {
        for (let i = 0; i < object.size(); i++) pending.push(object.get(i))
      }
    }
    parentPort.postMessage({ valid: true, pages: pages.length })
  } catch { parentPort.postMessage({ valid: false }) }
})()
`

export async function validateDisclosurePdf(buffer) {
  if (!Buffer.isBuffer(buffer) || !buffer.length || buffer.length > 10 * 1024 * 1024) throw badRequest('Choose a nonempty PDF no larger than 10 MB.')
  if (!/^%PDF-(?:1\.[0-7]|2\.0)/.test(buffer.subarray(0, 12).toString('ascii'))) throw badRequest('The file is not a valid PDF.')
  const tail = buffer.subarray(Math.max(0, buffer.length - 2048)).toString('latin1')
  const trailer = /startxref\s+(\d+)\s+%%EOF\s*$/.exec(tail)
  if (!trailer || Number(trailer[1]) >= buffer.length || !/^(?:xref|\d+\s+\d+\s+obj)/.test(buffer.subarray(Number(trailer[1]), Number(trailer[1]) + 60).toString('ascii'))) throw badRequest('The PDF is truncated or has an invalid trailer.')
  // Keep the parser an explicit server dependency so standalone builds retain it.
  if (typeof PDFDocument.load !== 'function') throw new Error('PDF parser unavailable')
  const nativeRequire = createRequire(import.meta.url)
  const result = await new Promise((resolve, reject) => {
    const worker = new Worker(workerSource, { eval: true, workerData: { bytes: buffer, parserPath: nativeRequire.resolve('@cantoo/pdf-lib') }, resourceLimits: { maxOldGenerationSizeMb: 128, maxYoungGenerationSizeMb: 32, stackSizeMb: 4 } })
    let settled = false
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      worker.terminate().catch(error => console.error('PDF worker cleanup failed:', error.name))
      if (error) reject(error)
      else resolve(value)
    }
    const timer = setTimeout(() => finish(badRequest('PDF validation timed out. Please use a simpler PDF.')), 8000)
    worker.once('message', message => finish(null, message))
    worker.once('error', () => finish(badRequest('The PDF could not be safely validated.')))
    worker.once('exit', () => { if (!settled) finish(badRequest('The PDF could not be safely validated.')) })
  })
  if (!result?.valid) throw badRequest('The PDF is malformed, encrypted, contains attachments or active actions, or exceeds validation limits. Upload a plain PDF without those features.')
  return result
}

export async function disclosureDirectory() {
  const directory = resolveUploadPath('disclosures')
  await fs.mkdir(directory, { recursive: true, mode: 0o700 })
  const root = await fs.realpath(path.resolve(process.cwd(), 'uploads'))
  const stat = await fs.lstat(directory)
  if (stat.isSymbolicLink() || await fs.realpath(directory) !== path.join(root, 'disclosures')) throw new Error('Unsafe disclosure storage directory')
  return directory
}

export async function disclosureFileAvailable(version) {
  if (!version || !disclosureFilePath.test(version.path)) return false
  try {
    const directory = await disclosureDirectory()
    const filePath = resolveUploadPath(version.path)
    const stat = await fs.lstat(filePath)
    return stat.isFile() && !stat.isSymbolicLink() && stat.size === version.size && await fs.realpath(filePath) === path.join(await fs.realpath(directory), path.basename(filePath))
  } catch { return false }
}

export async function storeDisclosurePdf(file, req) {
  if (!file || !file.size) throw badRequest('Choose a PDF file.')
  if (file.size > 10 * 1024 * 1024) throw badRequest('The PDF must be no larger than 10 MB.')
  if (file.type !== 'application/pdf' || path.extname(file.name).toLowerCase() !== '.pdf' || /[\\/\u0000-\u001f:]/.test(file.name) || file.name.length > 180) throw badRequest('Choose a PDF with a simple .pdf filename.')
  const buffer = Buffer.from(await file.arrayBuffer())
  await validateDisclosurePdf(buffer)
  const directory = await disclosureDirectory()
  // Bound even crash-orphan accumulation; monitoring/volume quota is still required.
  const entries = await fs.readdir(directory)
  if (entries.length >= 200) throw Object.assign(new Error('Disclosure storage needs a retention review before more PDFs can be uploaded.'), { status: 409 })
  const storedPath = `disclosures/${randomUUID()}.pdf`
  await writeLocalUpload(storedPath, buffer, { flag: 'wx', mode: 0o600, onCreated: () => req.newUploads.push(storedPath) })
  const version = { path: storedPath, originalName: file.name, size: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex'), uploadedAt: new Date() }
  if (!(await disclosureFileAvailable(version))) throw new Error('Disclosure storage verification failed')
  return version
}
