import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PDFDocument, PDFName, PDFString } from '@cantoo/pdf-lib'
import { validateDisclosurePdf } from '../src/server/security/disclosurePdf.js'
import { documentTitleError, fixedDisclosureDocuments } from '../src/content/disclosureDocuments.js'
import { plainPdf } from './helpers/disclosure-pdf.js'

test('structural PDF validation accepts plain PDFs including compressed object streams', async () => {
  for (const useObjectStreams of [false, true]) {
    const { bytes } = await plainPdf({ useObjectStreams })
    assert.equal((await validateDisclosurePdf(bytes)).valid, true)
  }
})
test('empty, fake, oversized and truncated PDF files are rejected', async () => {
  const { bytes } = await plainPdf()
  for (const buffer of [Buffer.alloc(0), Buffer.from('%PDF-1.4\nfake\n%%EOF'), Buffer.from('<html>fake.pdf</html>'), Buffer.alloc(10 * 1024 * 1024 + 1), bytes.subarray(0, bytes.length - 15)]) await assert.rejects(validateDisclosurePdf(buffer), { status: 400 })
})
test('compressed JavaScript/open actions, attachments, unsafe links and encrypted documents are rejected', async () => {
  for (const kind of ['javascript', 'attachment', 'uri', 'encrypted']) {
    const { document } = await plainPdf()
    if (kind === 'attachment') await document.attach(Buffer.from('MZ fake executable'), 'unsafe.exe')
    if (kind === 'javascript') document.catalog.set(PDFName.of('OpenAction'), document.context.obj({ S: PDFName.of('JavaScript'), JS: PDFString.of('app.alert(1)') }))
    if (kind === 'uri') document.catalog.set(PDFName.of('UnsafeTest'), document.context.obj({ S: PDFName.of('URI'), URI: PDFString.of('https://example.test') }))
    if (kind === 'encrypted') document.context.trailerInfo.Encrypt = document.context.register(document.context.obj({ Filter: PDFName.of('Standard'), V: 1, R: 2, O: PDFString.of('x'), U: PDFString.of('x'), P: -4 }))
    await assert.rejects(validateDisclosurePdf(Buffer.from(await document.save({ useObjectStreams: true }))), { status: 400 }, kind)
  }
})
test('fixed and confusing names cannot be used by additional documents', () => {
  for (const document of fixedDisclosureDocuments) {
    assert.ok(documentTitleError(document.name))
    assert.ok(documentTitleError(document.rowLabel))
    assert.ok(documentTitleError(document.key))
  }
  for (const name of ['', '  ', 'x'.repeat(161), 'Fire Safety Certificate Updated', 'name\r\nunsafe']) assert.ok(documentTitleError(name))
  assert.equal(documentTitleError('A distinct school-approved report'), '')
})
