import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React, { useState, useEffect } from 'react'
import { GraduationCap } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader.jsx'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'
import StaffCard from '../../components/common/StaffCard.jsx'
import api from '../../services/api.js'
import { getMediaUrl } from '../../utils/media.js'

const TeachingStaff = () => {
  const c = useSiteContent()
  const [teachingStaff, setTeachingStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeachingStaff()
  }, [])

  const fetchTeachingStaff = async () => {
    try {
      const data = await api.get('/teaching-staff')
      setTeachingStaff(data.data || [])
    } catch (error) {
      console.error('Error fetching teaching staff:', error)
      setTeachingStaff([])
    } finally {
      setLoading(false)
    }
  }

  const categories = {
    prt: { label: c('administration.teachingStaff.categories.prt.label'), icon: '👶' },
    tgt: { label: c('administration.teachingStaff.categories.tgt.label'), icon: '📚' },
    pgt: { label: c('administration.teachingStaff.categories.pgt.label'), icon: '🎓' }
  }

  const groupedStaff = teachingStaff.reduce((acc, item) => {
    const category = item.category || 'tgt'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  if (loading) {
    return (
      <div>
        <PageHeader homeLabel={c('administration.teachingStaff.breadcrumb.home')} title={c('administration.teachingStaff.pageHeader.title')} subtitle={c('administration.teachingStaff.pageHeader.subtitle')} icon={<GraduationCap size={18} />} />
        <section className="section-padding">
          <div className="container-custom flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-maroon-600 border-t-transparent"></div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageHeader homeLabel={c('administration.teachingStaff.breadcrumb.home')} title={c('administration.teachingStaff.pageHeader.title')} subtitle={c('administration.teachingStaff.pageHeader.subtitle')} icon={<GraduationCap size={18} />} />
      <section className="section-padding">
        <div className="container-custom">
          {Object.keys(categories).map((categoryKey) => {
            const items = groupedStaff[categoryKey] || []
            if (items.length === 0) return null

            return (
              <div key={categoryKey} className="mb-8">
                <SectionWrapper>
                  <h2 className="font-serif text-xl font-bold text-maroon-900 mb-4 flex items-center gap-2">
                    <span>{categories[categoryKey].icon}</span>
                    {categories[categoryKey].label}
                    <span className="text-sm font-normal text-gray-500 ml-2">({items.length})</span>
                  </h2>
                </SectionWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((t) => (
                    <StaffCard 
                      key={t._id} 
                      name={t.name} 
                      subject={t.designation} 
                      qualification={t.qualification} 
                      photo={getMediaUrl(t.image)} 
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {teachingStaff.length === 0 && (
            <p className="text-center text-gray-500 py-8">{c('administration.teachingStaff.copy.text.paragraph.no-teaching-staff-members--e3de0c26')}</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default TeachingStaff