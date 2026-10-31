import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React, { useState, useEffect } from 'react'
import { Contact } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader.jsx'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'
import api from '../../services/api.js'
import { getMediaUrl } from '../../utils/media.js'

const Staff = () => {
  const c = useSiteContent()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const data = await api.get('/staff')
      setStaff(data.data || [])
    } catch (error) {
      console.error('Error fetching staff:', error)
      setStaff([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader homeLabel={c('administration.staff.breadcrumb.home')} title={c('administration.staff.pageHeader.title')} subtitle={c('administration.staff.pageHeader.subtitle')} icon={<Contact size={18} />} />
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
      <PageHeader homeLabel={c('administration.staff.breadcrumb.home')} title={c('administration.staff.pageHeader.title')} subtitle={c('administration.staff.pageHeader.subtitle')} icon={<Contact size={18} />} />
      <section className="section-padding">
        <div className="container-custom">
          <SectionWrapper>
            <h2 className="font-serif text-xl font-bold text-maroon-900 mb-4">{c('administration.staff.copy.non-teaching-staff.heading.non-teaching-staff-bb622965')}</h2>
          </SectionWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {staff.length === 0 ? (
              <p className="text-center text-gray-500 col-span-3">{c('administration.staff.copy.non-teaching-staff.paragraph.no-staff-members-found-91906373')}</p>
            ) : (
              staff.map((s) => (
                <SectionWrapper key={s._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={getMediaUrl(s.image) || `https://ui-avatars.com/api/?name=${s.name}&background=7A0C1E&color=fff&size=40`}
                      alt={s.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-maroon-900 text-sm">{s.name}</p>
                      <p className="text-xs text-gold-600 font-medium mt-0.5">{s.designation}</p>
                      {s.qualification && <p className="text-xs text-gray-400">{s.qualification}</p>}
                    </div>
                  </div>
                </SectionWrapper>
              ))
            )}
          </div>

          <SectionWrapper>
            <h2 className="font-serif text-xl font-bold text-maroon-900 mb-4">{c('administration.staff.copy.a-glimpse-of-our-facul.heading.a-glimpse-of-our-faculty-84f0beab')}</h2>
          </SectionWrapper>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Teaching staff will be displayed here */}
            <p className="text-center text-gray-500 col-span-4">{c('administration.staff.copy.a-glimpse-of-our-facul.paragraph.teaching-staff-list-coming-19d19643')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Staff