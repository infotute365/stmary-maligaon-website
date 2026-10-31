import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { contentFields, contentRegistry } from '../src/content/registry.js'

const require = createRequire(import.meta.url)
const { transformSync } = require('next/dist/compiled/babel/core.js')
const jsx = require('next/dist/compiled/babel/plugin-syntax-jsx.js')
const modules = require('next/dist/compiled/babel/plugin-transform-modules-commonjs.js')
const reactPreset = require('next/dist/compiled/babel/preset-react.js')
const original = JSON.parse(readFileSync(new URL('./fixtures/site-content-original.json', import.meta.url)))
const root = path.resolve('.')

// Compare actual server-rendered DOM with the pre-change source fixture. Effects stay
// inactive and animation props are stripped identically on both sides; no DB is used.
function renderer(before, overrides = {}, mobileOpen = false, slideIndex = 0) {
  const cache = new Map()
  const motion = new Proxy({}, { get: (_target, tag) => ({ children, ...props }) => {
    for (const key of ['initial', 'animate', 'exit', 'transition', 'variants', 'viewport', 'whileInView', 'whileHover', 'whileTap', 'layoutId']) delete props[key]
    return React.createElement(tag, props, children)
  } })
  const routing = {
    Link: ({ to, href, children, ...props }) => React.createElement('a', { ...props, href: href ?? to }, children),
    NavLink: ({ to, children, className, ...props }) => React.createElement('a', { ...props, href: to, className: typeof className === 'function' ? className({ isActive: to === '/' }) : className }, children),
  }
  const content = { useSiteContent: () => key => overrides[key] ?? contentRegistry[key]?.defaultValue ?? '' }
  function load(file) {
    file = file.replaceAll('\\', '/')
    if (cache.has(file)) return cache.get(file)
    const source = before && original[file] ? original[file] : readFileSync(path.join(root, file), 'utf8')
    const result = transformSync(source, { babelrc: false, configFile: false, presets: [[reactPreset, { runtime: 'classic' }]], plugins: [jsx, modules], filename: file })
    const output = { exports: {} }
    const localRequire = name => {
      if (name === 'react') {
        if (mobileOpen && file.endsWith('Navbar.jsx')) return { ...React, useState: () => [true, () => {}] }
        if (file.endsWith('HeroCarousel.jsx')) return { ...React, useState: value => React.useState(typeof value === 'number' ? slideIndex : value) }
        return React
      }
      if (name === 'framer-motion') return { motion, AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children), useScroll: () => ({ scrollY: 0 }), useTransform: () => 0 }
      if (name === '@/routing') return routing
      if (name === '@/content/SiteContentProvider.jsx') return content
      if (/\.(png|jpeg|webp)$/.test(name)) return { src: name }
      if (name.startsWith('.')) return load(path.posix.normalize(path.posix.join(path.posix.dirname(file), name)))
      return require(name)
    }
    vm.runInNewContext(`(function(require,module,exports){${result.code}\n})`, { console, setTimeout, clearTimeout })(localRequire, output, output.exports)
    cache.set(file, output.exports)
    return output.exports
  }
  return file => renderToStaticMarkup(React.createElement(load(file).default))
}

for (const file of Object.keys(original)) {
  test(`exact fallback DOM, classes, assets and fixed links: ${file}`, () => {
    assert.equal(renderer(false)(file), renderer(true)(file))
  })
}
test('desktop and mobile navigation retain the exact default DOM', () => {
  const file = 'src/components/layout/Navbar.jsx'
  assert.equal(renderer(false, {}, true)(file), renderer(true, {}, true)(file))
})
test('all five hero slides retain their original defaults and image references', () => {
  const file = 'src/components/home/HeroCarousel.jsx'
  for (let index = 0; index < 5; index++) assert.equal(renderer(false, {}, false, index)(file), renderer(true, {}, false, index)(file))
})
test('edits render as escaped React text and desktop/mobile Home labels stay synchronized', () => {
  const value = '<img src=x onerror=alert(1)>'
  const html = renderer(false, { 'home.hero.slide1.title': value })('src/components/home/HeroCarousel.jsx')
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'))
  assert.ok(!html.includes(value))
  const navigation = renderer(false, { 'global.navigation.home': 'Start here' }, true)('src/components/layout/Navbar.jsx')
  assert.equal((navigation.match(/Start here/g) || []).length, 2)
})
test('every exposed field is connected to a Phase 1 public component', () => {
  const sources = Object.keys(original).map(file => readFileSync(path.join(root, file), 'utf8')).join('\n')
  for (const field of contentFields.filter(field => ['global', 'home'].includes(field.group))) {
    assert.ok(sources.includes(`'${field.key}'`) || /^home\.hero\.slide[1-5]\.(title|subtitle)$/.test(field.key), `Unconnected field: ${field.key}`)
  }
})
