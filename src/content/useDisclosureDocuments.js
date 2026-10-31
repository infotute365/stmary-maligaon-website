'use client'

import { useEffect, useState } from 'react'
import { disclosureOriginals, fixedDisclosureDocuments, disclosureFilePath, customDisclosureKey, documentTitleError } from './disclosureDocuments.js'

let pending
function safeDocumentUrl(url, original) {
  return typeof url === 'string' && (url === original || (url.startsWith('/api/files/') && disclosureFilePath.test(url.slice('/api/files/'.length))))
}
function approvedDocuments(data) {
  const result = disclosureOriginals()
  for (const document of fixedDisclosureDocuments) {
    const candidate = data?.fixed?.[document.key]
    if (safeDocumentUrl(candidate?.url, document.url)) result.fixed[document.key].url = candidate.url
  }
  for (const document of Array.isArray(data?.additional) ? data.additional.slice(0, 50) : []) {
    if (customDisclosureKey.test(document?.key) && !documentTitleError(document.name) && safeDocumentUrl(document.url)) result.additional.push({ key: document.key, name: document.name, url: document.url })
  }
  return result
}
function loadDocuments() {
  if (!pending) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    pending = fetch('/api/disclosure-documents', { cache: 'no-store', credentials: 'omit', signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Disclosure updates unavailable')
      const payload = await response.json()
      if (!payload.success || !payload.data) throw new Error('Invalid disclosure response')
      return approvedDocuments(payload.data)
    }).finally(() => { clearTimeout(timer); pending = null })
  }
  return pending
}

export function useDisclosureDocuments() {
  const [documents, setDocuments] = useState(disclosureOriginals)
  useEffect(() => {
    let active = true, generation = 0
    const refresh = () => {
      const current = ++generation
      loadDocuments().then(next => {
        if (active && generation === current) setDocuments(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next)
      }).catch(() => { /* Original/last working URLs remain available during a metadata outage. */ })
    }
    const visible = () => { if (document.visibilityState === 'visible') refresh() }
    refresh()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', visible)
    return () => { active = false; window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', visible) }
  }, [])
  return documents
}
