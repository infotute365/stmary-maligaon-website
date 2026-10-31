import { PDFDocument } from '@cantoo/pdf-lib'

export async function plainPdf(options = {}) {
  const document = await PDFDocument.create()
  document.addPage([200, 200]).drawText('Disposable disclosure PDF test')
  return { document, bytes: Buffer.from(await document.save(options)) }
}
