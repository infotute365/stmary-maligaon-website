import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const WelcomeSection = () => {
  const c = useSiteContent()
  const highlights = [
    c('home.welcome.highlight1'),
    c('home.welcome.highlight2'),
    c('home.welcome.highlight3'),
    c('home.welcome.highlight4')
  ]


  return (
    <section className="section-padding bg-white">
      <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80"
            alt="School campus"
            className="rounded-3xl shadow-2xl w-full h-[380px] object-cover"
          />
          <div className="absolute -bottom-6 -right-6 bg-gold-400 text-maroon-900 rounded-2xl shadow-xl px-6 py-4">
            <p className="font-serif text-2xl font-bold">{c('global.school.established')}</p>
            <p className="text-xs font-semibold tracking-wide">{c('home.welcome.established')}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase">{c('home.welcome.welcome-to')}</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-maroon-900 mt-2 mb-4">
            {c('global.school.name')}, {c('global.school.branch')}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">{c('home.welcome.for-over-three-decades-we-have-been-committed-to-providing-qualit')}</p>

          <ul className="space-y-3 mb-8">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 size={18} className="text-maroon-700 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>

          <a href="/about/history" className="btn-primary">{c('home.welcome.read-our-story')}</a>
        </motion.div>
      </div>
    </section>
  )
}

export default WelcomeSection
