import React, { useEffect, useRef, useState } from 'react'
import { disclosureDocumentsApi } from '../utils/disclosureDocumentsApi.js'
import { documentTitleError } from '../../content/disclosureDocuments.js'

export default function DisclosureDocumentsPanel({ mode, onDirtyChange, onBusyChange }) {
  const [data, setData] = useState({ fixed: [], additional: [], maximumAdditional: 50 })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retry, setRetry] = useState(0)
  const [files, setFiles] = useState({})
  const [titles, setTitles] = useState({})
  const [newTitle, setNewTitle] = useState('')
  const [busy, setBusy] = useState('')
  const [messages, setMessages] = useState({})
  const [enabled, setEnabled] = useState(true)
  const mounted = useRef(false)
  const dirty = !!newTitle || Object.values(files).some(Boolean) || data.additional.some(document => Object.hasOwn(titles, document.key) && titles[document.key] !== document.name)

  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setLoadError('')
    disclosureDocumentsApi.read(controller.signal).then(payload => {
      if (controller.signal.aborted) return
      if (!payload.success || !Array.isArray(payload.data?.fixed) || !Array.isArray(payload.data?.additional)) throw new Error('Unable to load documents')
      setData(payload.data); setEnabled(payload.overridesEnabled)
    }).catch(error => {
      if (!controller.signal.aborted) setLoadError(error.response?.data?.message || 'Unable to load documents. Please retry.')
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [retry])
  useEffect(() => { onDirtyChange(dirty) }, [dirty, onDirtyChange])
  useEffect(() => { onBusyChange(!!busy); return () => onBusyChange(false) }, [busy, onBusyChange])
  useEffect(() => () => onDirtyChange(false), [onDirtyChange])

  function message(key, value) { setMessages(previous => ({ ...previous, [key]: value })) }
  function chooseFile(key, file) {
    if (!file) { setFiles(previous => ({ ...previous, [key]: null })); return }
    if (file.size === 0 || file.size > 10 * 1024 * 1024 || !/\.pdf$/i.test(file.name) || file.type !== 'application/pdf') {
      message(key, { error: 'Choose a nonempty PDF no larger than 10 MB.' })
      setFiles(previous => ({ ...previous, [key]: null }))
      return
    }
    setFiles(previous => ({ ...previous, [key]: file }))
    message(key, {})
  }
  async function run(key, operation, success, remove = false, { keepFile = false, keepTitle = false } = {}) {
    setBusy(key); message(key, {})
    try {
      const payload = await operation()
      if (!payload.success) throw new Error('Document operation did not complete')
      if (!mounted.current) return
      if (remove) setData(previous => ({ ...previous, additional: previous.additional.filter(document => document.key !== key) }))
      else {
        const saved = payload.data
        setData(previous => ({ ...previous, [saved.type === 'fixed' ? 'fixed' : 'additional']:
          key === 'new' ? [...previous.additional, saved] : previous[saved.type === 'fixed' ? 'fixed' : 'additional'].map(document => document.key === key ? saved : document) }))
      }
      if (!keepFile) setFiles(previous => ({ ...previous, [key]: null }))
      if (!keepTitle) setTitles(previous => { const next = { ...previous }; delete next[key]; return next })
      if (key === 'new') setNewTitle('')
      message(key, { success })
    } catch (error) {
      if (mounted.current) message(key, { error: error.response?.data?.message || 'The document was not saved. Your selected file and name have been kept.', conflict: error.response?.status === 409 })
    } finally { if (mounted.current) setBusy('') }
  }
  function replace(document) {
    if (!files[document.key]) return
    if (!window.confirm(`Replace the public PDF for “${document.name}”? Its name stays the same. The previous working version will be retained for recovery.`)) return
    run(document.key, () => disclosureDocumentsApi.replace(document.key, document.revision, files[document.key]), 'Replacement saved. The public document now uses the new PDF.', false, { keepTitle: true })
  }
  function restore(document, version) {
    if (!window.confirm(`Restore the ${version === 'original' ? 'original school PDF' : 'retained previous PDF'} for “${document.name}”?`)) return
    run(document.key, () => disclosureDocumentsApi.restore(document.key, document.revision, version), 'Document version restored.', false, { keepTitle: true })
  }
  function publishNew() {
    const error = documentTitleError(newTitle)
    if (error || !files.new) { message('new', { error: error || 'Choose a PDF file.' }); return }
    if (!window.confirm(`Publish “${newTitle.trim()}” as an additional disclosure document?`)) return
    run('new', () => disclosureDocumentsApi.create(newTitle.trim(), files.new), 'Additional document published.')
  }
  function saveTitle(document) {
    const title = titles[document.key] ?? document.name
    const error = documentTitleError(title)
    if (error) { message(document.key, { error }); return }
    run(document.key, () => disclosureDocumentsApi.update(document.key, document.revision, { title }), 'Document name saved.', false, { keepFile: true })
  }
  function remove(document) {
    if (!window.confirm(`Remove the additional document “${document.name}”? Its current and retained PDF files will be removed after the entry is deleted. Fixed disclosure documents are unaffected.`)) return
    run(document.key, () => disclosureDocumentsApi.remove(document.key, document.revision), 'Additional document removed.', true)
  }
  const feedback = key => <>
    {messages[key]?.error && <p role="alert" className="text-sm text-red-700 mt-2">{messages[key].error}</p>}
    {messages[key]?.success && <p role="status" className="text-sm text-green-700 mt-2">{messages[key].success}</p>}
    {messages[key]?.conflict && <button type="button" disabled={!!busy} className="text-sm text-maroon-800 underline mt-2" onClick={() => {
      if (window.confirm('Reload the latest document list? Any selected files and name edits in this panel will be discarded.')) { setFiles({}); setTitles({}); setNewTitle(''); setMessages({}); setRetry(value => value + 1) }
    }}>Reload latest documents</button>}
  </>
  const button = 'px-4 py-2 rounded-lg border border-gray-300 text-sm text-maroon-800 disabled:opacity-50'
  if (loading) return <p role="status">Loading disclosure documents…</p>
  if (loadError) return <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-xl">{loadError}<button type="button" className="underline ml-3" onClick={() => setRetry(value => value + 1)}>Retry</button></div>
  return <div>
    {!enabled && <p role="status" className="p-3 mb-4 bg-gold-50 rounded-lg text-sm text-maroon-800">Document updates are temporarily hidden by server configuration. Original PDFs are shown publicly; saved versions are retained.</p>}
    {mode === 'additional' && <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
      <h2 className="font-semibold text-lg text-maroon-900 mb-4">Add an additional document</h2>
      <label htmlFor="additional-document-name" className="block text-sm font-medium mb-2">Document Name</label>
      <input id="additional-document-name" type="text" maxLength={160} value={newTitle} disabled={!!busy} onChange={event => setNewTitle(event.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4" />
      <label htmlFor="additional-document-pdf" className="block text-sm font-medium mb-2">PDF File</label>
      <input key={data.additional.length} id="additional-document-pdf" type="file" accept="application/pdf,.pdf" disabled={!!busy} onChange={event => chooseFile('new', event.target.files?.[0])} className="block w-full text-sm mb-3" />
      <p className="text-xs text-gray-500 mb-3">PDF only, maximum 10 MB. Use a distinct name. Fixed document names are reserved. Additional documents appear after the current fixed rows.</p>
      <button type="button" disabled={!!busy || data.additional.length >= data.maximumAdditional} onClick={publishNew} className="px-4 py-2 bg-maroon-800 text-white rounded-lg text-sm font-semibold disabled:opacity-50">{busy === 'new' ? 'Publishing…' : 'Publish document'}</button>
      {feedback('new')}
    </section>}
    <h2 className="text-lg font-semibold text-maroon-900 mb-4">{mode === 'fixed' ? 'Fixed disclosure PDFs' : 'Additional documents'}</h2>
    {mode === 'fixed' && <p className="text-sm text-gray-600 mb-4">The 12 original document names and their order are fixed. Replace only the PDF that belongs to the named entry.</p>}
    {mode === 'additional' && !data.additional.length && <p className="text-sm text-gray-500">No additional documents have been published.</p>}
    {(mode === 'fixed' ? data.fixed : data.additional).map((document, index) => <section key={document.key} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-5">
      <h3 className="font-semibold text-maroon-900">{document.name}</h3>
      <p className="text-xs text-gray-500 mt-1">{document.type === 'fixed' ? 'Fixed name · ' + (document.hasReplacement ? 'Replacement PDF' : 'Original PDF') : document.active ? 'Published additional document' : 'Hidden additional document'}</p>
      {document.missingFile && <p role="alert" className="text-sm text-red-700 mt-2">The stored PDF is unavailable. {document.type === 'fixed' ? 'The original PDF is being used.' : 'Upload a replacement to restore this document.'}</p>}
      <div className="flex flex-wrap gap-4 my-3 text-sm">
        {document.url && <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-maroon-800 underline">View current PDF ↗</a>}
        {document.previous && <a href={document.previous.url} target="_blank" rel="noopener noreferrer" className="text-maroon-800 underline">View retained previous PDF ↗</a>}
      </div>
      {document.current && <p className="text-xs text-gray-500 mb-3">{document.current.originalName} · {(document.current.size / (1024 * 1024)).toFixed(2)} MB</p>}
      {document.type === 'additional' && <div className="mb-4">
        <label htmlFor={`document-title-${index}`} className="block text-sm font-medium mb-2">Document Name</label>
        <input id={`document-title-${index}`} type="text" maxLength={160} value={titles[document.key] ?? document.name} disabled={!!busy} onChange={event => setTitles(previous => ({ ...previous, [document.key]: event.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <div className="flex flex-wrap gap-2 mt-3">
          <button type="button" disabled={!!busy || !Object.hasOwn(titles, document.key) || titles[document.key] === document.name} onClick={() => saveTitle(document)} className={button}>Save name</button>
          <button type="button" disabled={!!busy} onClick={() => run(document.key, () => disclosureDocumentsApi.update(document.key, document.revision, { active: !document.active }), document.active ? 'Document hidden from the public list.' : 'Document published.', false, { keepFile: true, keepTitle: true })} className={button}>{document.active ? 'Hide document' : 'Publish document'}</button>
        </div>
      </div>}
      <label htmlFor={`document-file-${index}`} className="block text-sm font-medium mb-2">Replacement PDF</label>
      <input key={document.current?.url || document.url} id={`document-file-${index}`} type="file" accept="application/pdf,.pdf" disabled={!!busy} onChange={event => chooseFile(document.key, event.target.files?.[0])} className="block w-full text-sm" />
      {files[document.key] && <p className="text-xs text-gray-600 mt-2">Selected replacement: {files[document.key].name}</p>}
      <p className="text-xs text-gray-500 mt-2">Maximum 10 MB. Plain PDFs without encryption, attachments or active actions.</p>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="button" disabled={!!busy || !files[document.key]} onClick={() => replace(document)} className="px-4 py-2 bg-maroon-800 text-white rounded-lg text-sm font-semibold disabled:opacity-50">{busy === document.key ? 'Working…' : 'Replace PDF'}</button>
        {document.type === 'fixed' && <button type="button" disabled={!!busy || (!document.hasReplacement && !document.missingFile)} onClick={() => restore(document, 'original')} className={button}>Restore Original</button>}
        {document.previous && <button type="button" disabled={!!busy} onClick={() => restore(document, 'previous')} className={button}>Recover Previous</button>}
        {document.type === 'additional' && <button type="button" disabled={!!busy} onClick={() => remove(document)} className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm disabled:opacity-50">Remove additional document</button>}
      </div>
      {feedback(document.key)}
    </section>)}
  </div>
}
