'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { contentRegistry } from './registry.js'
import { approvedOverrides } from './validation.js'
import { publicContentGroups } from './pages.js'

const ContentContext = createContext({})
// Only pending requests are shared. Every mount/navigation/return to the tab gets fresh data.
const pending = new Map()
function loadGroup(group) {
  if (!pending.has(group)) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    const request = fetch(`/api/site-content?group=${encodeURIComponent(group)}`, { cache: 'no-store', credentials: 'omit', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Content unavailable')
        const payload = await response.json()
        if (!payload.success || !payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) throw new Error('Invalid content response')
        return approvedOverrides(group, Object.entries(payload.data).map(([key, value]) => ({ key, value })))
      }).finally(() => { clearTimeout(timer); pending.delete(group) })
    pending.set(group, request)
  }
  return pending.get(group)
}

export function SiteContentProvider({ homepage, pageGroup = homepage ? 'home' : null, children }) {
  const [groups, setGroups] = useState({})
  useEffect(() => {
    let active = true
    let generation = 0
    const refresh = () => {
      const current = ++generation
      for (const group of publicContentGroups(pageGroup)) {
        loadGroup(group).then(values => {
          if (!active || current !== generation) return
          setGroups(previous => JSON.stringify(previous[group]) === JSON.stringify(values) ? previous : { ...previous, [group]: values })
        }).catch(() => { /* Retain defaults, or the last successful values during a transient outage. */ })
      }
    }
    refresh()
    const onVisible = () => { if (document.visibilityState === 'visible') refresh() }
    window.addEventListener('focus', refresh)
    window.addEventListener('site-content-changed', refresh)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      active = false
      window.removeEventListener('focus', refresh)
      window.removeEventListener('site-content-changed', refresh)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [pageGroup])
  const values = useMemo(() => ({ ...groups.global, ...(pageGroup ? groups[pageGroup] : {}) }), [groups, pageGroup])
  return <ContentContext.Provider value={values}>{children}</ContentContext.Provider>
}

export function useSiteContent() {
  const values = useContext(ContentContext)
  return useCallback(key => values[key] ?? contentRegistry[key]?.defaultValue ?? '', [values])
}
