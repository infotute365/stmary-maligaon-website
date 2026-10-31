import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { siteContentApi } from '../utils/siteContentApi.js'
import { contentGroups } from '../../content/registry.js'
import { contentPages } from '../../content/pages.js'
import { contentValueError } from '../../content/validation.js'
import DisclosureDocumentsPanel from '../components/DisclosureDocumentsPanel.jsx'

const draftKey = 'stmarys-website-content-drafts-v1'
const valueFor = (field, drafts) => Object.hasOwn(drafts, field.key) ? drafts[field.key] : field.value

export default function SiteContentPage() {
  const [group, setGroup] = useState('global')
  const [fields, setFields] = useState([])
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [messages, setMessages] = useState({})
  const [busy, setBusy] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [retry, setRetry] = useState(0)
  const [sectionChoice, setSectionChoice] = useState('')
  const [search, setSearch] = useState('')
  const [resultLimit, setResultLimit] = useState(30)
  const mounted = useRef(false)
  const [recovered, setRecovered] = useState(false)
  const [documentDirty, setDocumentDirty] = useState(false)
  const [documentBusy, setDocumentBusy] = useState(false)
  const [disclosureView, setDisclosureView] = useState('text')
  const unsaved = documentDirty || fields.some(field => valueFor(field, drafts) !== field.value)
  const editorBusy = !!busy || documentBusy

  useEffect(() => {
    mounted.current = true
    try {
      const stored = JSON.parse(sessionStorage.getItem(draftKey) || '{}')
      if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
        setDrafts(stored)
        setRecovered(Object.keys(stored).length > 0)
      }
    } catch { /* Draft recovery is optional when browser storage is unavailable. */ }
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setLoadError('')
    siteContentApi.read(group, controller.signal).then(payload => {
      if (controller.signal.aborted) return
      if (!payload.success || !Array.isArray(payload.data)) throw new Error('Unable to load saved content.')
      setFields(payload.data)
      setEnabled(payload.overridesEnabled)
    }).catch(error => {
      if (!controller.signal.aborted) setLoadError(error.response?.data?.message || 'Unable to load saved content. Please retry.')
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [group, retry])

  useEffect(() => {
    const beforeUnload = event => {
      if (unsaved || editorBusy) { event.preventDefault(); event.returnValue = '' }
    }
    const beforeLink = event => {
      const anchor = event.target.closest?.('a[href]')
      if (!anchor || anchor.target === '_blank' || (!unsaved && !editorBusy)) return
      if (!window.confirm(editorBusy ? 'An update is still in progress. Leave this page?' : documentDirty ? 'You have an unsaved document selection or name. Leave this page and discard it?' : 'You have unsaved changes. Leave this page? Your draft will be kept in this tab.')) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    window.addEventListener('beforeunload', beforeUnload)
    document.addEventListener('click', beforeLink, true)
    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
      document.removeEventListener('click', beforeLink, true)
    }
  }, [unsaved, editorBusy, documentDirty])

  function storeDrafts(next) {
    setDrafts(next)
    try { sessionStorage.setItem(draftKey, JSON.stringify(next)) } catch { /* Navigation warning still protects edits. */ }
  }
  function clearDraft(key) {
    setDrafts(previous => {
      const next = { ...previous }
      delete next[key]
      try { sessionStorage.setItem(draftKey, JSON.stringify(next)) } catch { /* Optional recovery. */ }
      return next
    })
  }
  function changeGroup(next) {
    if (next === group || editorBusy) return
    if (unsaved && !window.confirm(documentDirty ? 'Switch pages? Unsaved PDF selections and document-name edits will be discarded.' : 'Switch sections? Unsaved drafts will be kept in this tab.')) return
    setFields([])
    setMessages({})
    setSectionChoice('')
    setSearch('')
    setResultLimit(30)
    setDisclosureView('text')
    setDocumentDirty(false)
    setGroup(next)
  }
  async function update(field, reset = false) {
    const value = valueFor(field, drafts)
    const error = reset ? '' : contentValueError(field, value)
    if (error) { setMessages(previous => ({ ...previous, [field.key]: { error } })); return }
    if (reset && !window.confirm(`Restore the original text for “${field.label}”? This also discards its unsaved draft.`)) return
    setBusy(field.key)
    setMessages(previous => ({ ...previous, [field.key]: {} }))
    try {
      const payload = await (reset ? siteContentApi.reset(field.key, field.revision) : siteContentApi.save(field.key, value, field.revision))
      if (!payload.success) throw new Error('The update was not saved.')
      if (!mounted.current) return
      setFields(previous => previous.map(item => item.key === field.key ? { ...item, ...payload.data } : item))
      clearDraft(field.key)
      setMessages(previous => ({ ...previous, [field.key]: { success: reset ? 'Original text restored.' : 'Saved successfully.' } }))
      window.dispatchEvent(new Event('site-content-changed'))
    } catch (error) {
      if (mounted.current) setMessages(previous => ({ ...previous, [field.key]: {
        error: error.response?.data?.message || 'Unable to save. Your draft has been kept. Please retry.',
        conflict: error.response?.status === 409,
      } }))
    } finally { if (mounted.current) setBusy('') }
  }
  async function reloadField(field) {
    if (!window.confirm('Load the latest saved text for this field? Its unsaved draft will be discarded.')) return
    setBusy(field.key)
    try {
      const payload = await siteContentApi.read(group)
      const latest = payload.data?.find(item => item.key === field.key)
      if (!payload.success || !latest) throw new Error('Unable to reload')
      if (!mounted.current) return
      setFields(previous => previous.map(item => item.key === field.key ? latest : item))
      clearDraft(field.key)
      setMessages(previous => ({ ...previous, [field.key]: { success: 'Latest saved text loaded. You can edit it again.' } }))
    } catch {
      if (mounted.current) setMessages(previous => ({ ...previous, [field.key]: { error: 'Unable to reload. Your draft has been kept.', conflict: true } }))
    } finally { if (mounted.current) setBusy('') }
  }

  const sections = [...new Set(fields.map(field => field.section))]
  const selectedSection = sections.includes(sectionChoice) ? sectionChoice : sections[0]
  const query = search.trim().toLowerCase()
  const matchingFields = fields.filter(field => query ? `${field.section} ${field.label} ${field.value}`.toLowerCase().includes(query) : field.section === selectedSection)
  const visibleFields = matchingFields.slice(0, resultLimit)
  const visibleSections = [...new Set(visibleFields.map(field => field.section))]
  const page = contentPages.find(page => page.group === group)
  const categories = [...new Set(contentPages.map(page => page.category))]
  return (
    <AdminLayout initialSidebarOpen={false}>
      <div className="max-w-5xl mx-auto min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div><h1 className="text-2xl font-bold text-maroon-900">Website Content</h1>
            <p className="text-sm text-gray-600 mt-2">Edit existing website text. Images, page layouts and link destinations stay fixed. Save each changed field.</p>
          </div>
          <a href={page?.path || '/'} target="_blank" rel="noopener noreferrer" className="btn-primary">View Public Page ↗</a>
        </div>
        {recovered && <p role="status" className="mb-4 p-3 rounded-lg bg-gold-50 text-maroon-800 text-sm">Drafts from this browser tab have been restored. Review them before saving.</p>}
        {!enabled && <p role="status" className="mb-4 p-3 rounded-lg bg-gold-50 text-maroon-800 text-sm">Public overrides are temporarily disabled by server configuration. Saved edits are retained.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div><label htmlFor="content-page" className="block text-sm font-semibold text-maroon-900 mb-2">Choose a page</label>
            <select id="content-page" value={group} disabled={editorBusy} onChange={event => changeGroup(event.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              {categories.map(category => <optgroup key={category} label={category}>{contentPages.filter(page => page.category === category).map(page => <option key={page.group} value={page.group}>{contentGroups[page.group]}</option>)}</optgroup>)}
            </select>
          </div>
          {(group !== 'cbse.disclosure' || disclosureView === 'text') && <div><label htmlFor="content-section" className="block text-sm font-semibold text-maroon-900 mb-2">Choose a section</label>
            <select id="content-section" value={selectedSection || ''} disabled={loading || !!busy || !sections.length} onChange={event => { setSectionChoice(event.target.value); setSearch(''); setResultLimit(30) }} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              {sections.map(section => <option key={section} value={section}>{section}</option>)}
            </select>
          </div>}
          {(group !== 'cbse.disclosure' || disclosureView === 'text') && <div className="sm:col-span-2"><label htmlFor="content-search" className="block text-sm font-semibold text-maroon-900 mb-2">Search fields on this page</label>
            <input id="content-search" type="search" value={search} disabled={loading || !!busy} onChange={event => { setSearch(event.target.value); setResultLimit(30) }} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Search a heading, label or current text" />
          </div>}
        </div>
        {group === 'cbse.disclosure' && <div role="group" aria-label="Mandatory disclosure editor" className="flex flex-wrap gap-2 mb-5">
          {[['text', 'Text & values'], ['fixed', 'Fixed PDFs'], ['additional', 'Additional Documents']].map(([view, label]) => <button key={view} type="button" disabled={editorBusy} aria-pressed={disclosureView === view} className={`px-4 py-2 rounded-lg text-sm ${disclosureView === view ? 'bg-maroon-800 text-white' : 'bg-white border border-gray-300 text-maroon-800'}`} onClick={() => {
            if (view === disclosureView) return
            if (documentDirty && !window.confirm('Switch document sections and discard unsaved file selections or names?')) return
            setDocumentDirty(false)
            setDisclosureView(view)
          }}>{label}</button>)}
        </div>}
        {group === 'cbse.disclosure' && disclosureView !== 'text' ? <DisclosureDocumentsPanel key={disclosureView} mode={disclosureView} onDirtyChange={setDocumentDirty} onBusyChange={setDocumentBusy} /> : <>
        <p role="status" className="text-sm text-gray-500 mb-6">{unsaved ? 'You have unsaved changes in this section.' : 'All displayed changes are saved.'}</p>
        {loading ? <p role="status">Loading saved content…</p> : loadError ? <div role="alert" className="p-4 bg-red-50 rounded-xl text-red-700">{loadError}<button className="ml-3 underline" onClick={() => setRetry(value => value + 1)}>Retry</button></div> : visibleSections.map(section => (
          <section key={section} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-semibold text-maroon-900 mb-5">{section}</h2>
            {section.startsWith('Hero Carousel') && <p className="text-xs text-gray-500 mb-4">Existing background image is preserved and cannot be edited.</p>}
            <div className="space-y-6">
              {visibleFields.filter(field => field.section === section).map((field, index) => {
                const value = valueFor(field, drafts)
                const dirty = value !== field.value
                const message = messages[field.key] || {}
                const id = `content-${sections.indexOf(section)}-${index}`
                const props = { id, value, disabled: !!busy, maxLength: field.maxLength, 'aria-describedby': `${id}-help`, 'aria-invalid': !!message.error,
                  onChange: event => {
                    storeDrafts({ ...drafts, [field.key]: field.type === 'number' && event.target.value !== '' ? Number(event.target.value) : event.target.value })
                    setMessages(previous => ({ ...previous, [field.key]: {} }))
                  }, className: 'w-full min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500 disabled:bg-gray-50' }
                return <div key={field.key}>
                  <div className="flex flex-wrap items-center gap-2 mb-2"><label htmlFor={id} className="text-sm font-medium text-gray-800">{field.label}</label>{dirty && <span className="text-xs font-semibold text-maroon-700">Unsaved</span>}</div>
                  {field.type === 'textarea' ? <textarea {...props} rows={5} /> : field.type === 'choice' ? <select {...props}>{field.options.map(option => <option key={option} value={option}>{option}</option>)}</select> : <input {...props} type={['number', 'email', 'tel'].includes(field.type) ? field.type : 'text'} min={field.type === 'number' ? 0 : undefined} max={field.type === 'number' ? 1000000 : undefined} step={field.type === 'number' ? 1 : undefined} inputMode={['url', 'webAddress'].includes(field.type) ? 'url' : ['statistic', 'integerText', 'year'].includes(field.type) ? 'numeric' : undefined} />}
                  <p id={`${id}-help`} className="text-xs text-gray-500 mt-1">{field.maxLength ? `${String(value).length} / ${field.maxLength} characters. ` : 'Whole number from 0 to 1,000,000. '}{field.type === 'url' ? 'Use the selected network’s HTTPS URL, or # for the original link. ' : ''}{field.type === 'integerText' ? 'Use digits only; existing string formatting is retained. ' : ''}{field.hasOverride ? 'Custom text saved.' : 'Using original website text.'}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button type="button" disabled={!dirty || !!busy} onClick={() => update(field)} className="px-4 py-2 bg-maroon-800 text-white rounded-lg text-sm font-semibold disabled:opacity-50">{busy === field.key ? 'Working…' : 'Save'}</button>
                    <button type="button" disabled={(!field.hasOverride && !dirty) || !!busy} onClick={() => update(field, true)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm disabled:opacity-50">Reset to original</button>
                    {message.conflict && <button type="button" disabled={!!busy} onClick={() => reloadField(field)} className="px-4 py-2 text-maroon-800 underline text-sm">Load latest saved text</button>}
                  </div>
                  {message.error && <p role="alert" className="text-sm text-red-700 mt-2">{message.error}</p>}
                  {message.success && <p role="status" className="text-sm text-green-700 mt-2">{message.success}</p>}
                </div>
              })}
            </div>
          </section>
        ))}
        {!loading && !loadError && !visibleFields.length && <p role="status" className="text-sm text-gray-500">No matching fields. Try a different search.</p>}
        {!loading && matchingFields.length > visibleFields.length && <button type="button" className="mb-6 px-4 py-2 border border-maroon-300 rounded-lg text-sm text-maroon-800" onClick={() => setResultLimit(limit => limit + 30)}>Show more fields ({matchingFields.length - visibleFields.length} remaining)</button>}
        </>}
      </div>
    </AdminLayout>
  )
}
