import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { contentRegistry } from '../../src/content/registry.js'
import { disclosureOriginals } from '../../src/content/disclosureDocuments.js'

const require = createRequire(import.meta.url)
const { transformSync } = require('next/dist/compiled/babel/core.js')
const reactPreset = require('next/dist/compiled/babel/preset-react.js')
const modules = require('next/dist/compiled/babel/plugin-transform-modules-commonjs.js')
export const originalPages = JSON.parse(readFileSync(new URL('../fixtures/site-content-pages-original.json', import.meta.url)))
const compiled = new Map()

export const exampleRecords = {
  Management: [{ _id: 'record-one', name: 'Existing member', designation: 'Existing designation', image: '/uploads/images/existing.png' }],
  ManagingCommittee: [{ _id: 'record-one', name: 'Existing member', designation: 'Existing designation', image: '/uploads/images/existing.png', tenure: 'Existing tenure' }],
  Staff: [{ _id: 'record-one', name: 'Existing member', designation: 'Existing designation', image: '/uploads/images/existing.png', qualification: 'Existing qualification' }],
  TeachingStaff: ['prt', 'tgt', 'pgt'].map(category => ({ _id: category, category, name: 'Existing teacher', designation: 'Existing subject', qualification: 'Existing qualification', image: '/uploads/images/existing.png' })),
  Gallery: [{ _id: 'event-one', eventName: 'Existing event', description: 'Existing description', date: '2026-01-15', images: [{ url: '/uploads/images/existing.png', caption: 'Existing caption' }] }],
  Downloads: [{ _id: 'download-one', title: 'Existing download', category: 'Existing category', file: '/api/files/downloads/existing.pdf' }],
}

export function pageRenderer({ before = false, originalOverride = {}, documents = null, realMotion = false } = {}) {
  const cache = new Map()
  let values = {}, activeFile = '', state = {}, keys = []
  const motion = new Proxy({}, { get: (_target, tag) => ({ children, ...props }) => {
    for (const key of ['initial', 'animate', 'exit', 'transition', 'variants', 'viewport', 'whileInView', 'whileHover', 'whileTap', 'layoutId']) delete props[key]
    return React.createElement(tag, props, children)
  } })
  const routing = {
    Link: ({ to, href, children, ...props }) => React.createElement('a', { ...props, href: href ?? to }, children),
    NavLink: ({ to, children, className, ...props }) => React.createElement('a', { ...props, href: to, className: typeof className === 'function' ? className({ isActive: false }) : className }, children),
    useNavigate: () => () => {},
  }
  function load(file) {
    file = file.replaceAll('\\', '/')
    if (!/\.[a-z]+$/i.test(file)) file += ['.jsx', '.js'].find(extension => { try { readFileSync(file + extension); return true } catch { return false } }) || ''
    if (cache.has(file)) return cache.get(file)
    const baseline = originalOverride[file] || originalPages[file]
    const source = before && baseline ? baseline : readFileSync(file, 'utf8')
    const compileKey = file + ':' + source
    if (!compiled.has(compileKey)) compiled.set(compileKey, transformSync(source, { babelrc: false, configFile: false, presets: [[reactPreset, { runtime: 'classic' }]], plugins: [modules], filename: file }).code)
    const output = { exports: {} }
    let stateIndex = 0
    const localRequire = name => {
      if (name === 'react') return { ...React,
        createElement: (type, props, ...children) => {
          if (props?.key !== undefined) keys.push(String(props.key))
          return React.createElement(type, props, ...children)
        },
        useState: initial => {
          const index = stateIndex++
          const override = file === activeFile && Object.hasOwn(state, index) ? state[index] : initial
          return React.useState(override)
        },
      }
      if (name === 'framer-motion') return realMotion ? require(name) : { motion, AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children), useInView: () => false, useAnimation: () => ({ start() {} }) }
      if (name === '@/routing') return routing
      if (name === '@/content/SiteContentProvider.jsx') return { useSiteContent: () => key => values[key] ?? contentRegistry[key]?.defaultValue ?? '' }
      if (name === '@/content/useDisclosureDocuments.js') return { useDisclosureDocuments: () => documents || disclosureOriginals() }
      if (name.startsWith('@/content/')) return load('src/content/' + name.slice('@/content/'.length))
      if (name.endsWith('/context/AuthContext.jsx')) return { useAuth: () => ({ login: async () => ({ success: false }) }) }
      if (/\/context\/AdminAuthContext(?:\.jsx)?$/.test(name)) return { useAdminAuth: () => ({ admin: { name: 'Test admin' }, logout() {} }) }
      if (/\.(png|jpeg|webp)$/.test(name)) return { src: name }
      if (name.startsWith('.')) return load(path.posix.normalize(path.posix.join(path.posix.dirname(file), name)))
      return require(name)
    }
    const fixedMath = Object.create(Math)
    fixedMath.random = () => 0.5
    vm.runInNewContext(`(function(require,module,exports){${compiled.get(compileKey)}\n})`, { console, setTimeout, clearTimeout, Math: fixedMath, process: { env: {} } })(localRequire, output, output.exports)
    // A fresh render gets fresh hook positions, including for the same cached component.
    const originalDefault = output.exports.default
    if (typeof originalDefault === 'function') output.exports.default = props => { stateIndex = 0; return originalDefault(props) }
    cache.set(file, output.exports)
    return output.exports
  }
  return (file, overrides = {}, states = {}, props = {}) => {
    activeFile = file; values = overrides; state = states; keys = []
    const html = renderToStaticMarkup(React.createElement(load(file).default, props))
    return { html, keys }
  }
}
