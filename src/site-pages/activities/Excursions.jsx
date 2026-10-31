import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react'
import { 
  Compass, 
  MapPin, 
  Building, 
  Landmark, 
  Users, 
  Calendar,
  Bus,
  Camera,
  Globe,
  Award
} from 'lucide-react'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'

const EducationalVisits = () => {
  const c = useSiteContent()
  const visitTypes = [
    { contentId: "Regional Science Center, Khanapara",
      icon: <MapPin size={16} />, 
      name: c('activities.excursions.visitTypes.regional-science-center-khanapara-60abec46.name'),
      description: c('activities.excursions.visitTypes.regional-science-center-khanapara-60abec46.description')
    },
    { contentId: "Factories",
      icon: <Building size={16} />, 
      name: c('activities.excursions.visitTypes.factories-18ea290d.name'),
      description: c('activities.excursions.visitTypes.factories-18ea290d.description')
    },
    { contentId: "Institutions",
      icon: <Landmark size={16} />, 
      name: c('activities.excursions.visitTypes.institutions-52afccc9.name'),
      description: c('activities.excursions.visitTypes.institutions-52afccc9.description')
    },
    { contentId: "Cultural Centres",
      icon: <Globe size={16} />, 
      name: c('activities.excursions.visitTypes.cultural-centres-e28bc72f.name'),
      description: c('activities.excursions.visitTypes.cultural-centres-e28bc72f.description')
    }
  ]

  return (
    <div>
      {/* Page Header without breadcrumb */}
      <div className="bg-gradient-to-r from-maroon-900 to-maroon-700 text-white py-6 px-4">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-500/20 rounded-lg">
              <Compass size={20} className="text-gold-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{c('activities.excursions.copy.educational-visits.heading.educational-visits-44b254c7')}</h1>
              <p className="text-sm text-gold-300/80 mt-0.5">{c('activities.excursions.copy.educational-visits.paragraph.learning-beyond-the-classr-9c7c3934')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">

          {/* Introduction */}
          <SectionWrapper className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-xl bg-maroon-50 flex items-center justify-center text-maroon-700">
                  <Bus size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-serif font-bold text-maroon-900 text-sm">{c('activities.excursions.copy.field-trips-excursions.heading.field-trips-excursions-5b0aedf1')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">{c('activities.excursions.copy.field-trips-excursions.paragraph.students-are-taken-on-regu-411a5d8c')}</p>
              </div>
            </div>
          </SectionWrapper>

          {/* Registered Institution */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100">
                <Award size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">{c('activities.excursions.copy.registered-with.heading.registered-with-184a983e')}</h4>
                <p className="text-sm font-medium text-blue-800">{c('activities.excursions.copy.registered-with.paragraph.regional-science-center-kh-60abec46')}</p>
                <p className="text-xs text-gray-600 mt-0.5">{c('activities.excursions.copy.registered-with.paragraph.students-from-various-clas-619db3d5')}</p>
              </div>
            </div>
          </div>

          {/* Visit Types Grid */}
          <h2 className="text-lg font-serif font-bold text-maroon-900 mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-gold-600" />{c('activities.excursions.copy.places-of-visit.heading.places-of-visit-4449ebbb')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {visitTypes.map((visit) => (
              <div 
                key={visit.contentId}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 hover:border-gold-300"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-lg bg-maroon-50 flex items-center justify-center text-maroon-700">
                      {visit.icon}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-maroon-800 text-sm">{visit.name}</h5>
                    <p className="text-xs text-gray-500 mt-0.5">{visit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-full bg-maroon-50 flex items-center justify-center mx-auto mb-1.5 text-maroon-700">
                <Users size={14} />
              </div>
              <p className="text-xs font-medium text-gray-700">{c('activities.excursions.copy.places-of-visit.paragraph.class-teachers-a69097f0')}</p>
              <p className="text-[10px] text-gray-400">{c('activities.excursions.copy.places-of-visit.paragraph.accompany-students-27105387')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-full bg-maroon-50 flex items-center justify-center mx-auto mb-1.5 text-maroon-700">
                <Calendar size={14} />
              </div>
              <p className="text-xs font-medium text-gray-700">{c('activities.excursions.copy.places-of-visit.paragraph.regular-visits-bc82f4c2')}</p>
              <p className="text-[10px] text-gray-400">{c('activities.excursions.copy.places-of-visit.paragraph.throughout-the-year-ee043e89')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-full bg-maroon-50 flex items-center justify-center mx-auto mb-1.5 text-maroon-700">
                <Compass size={14} />
              </div>
              <p className="text-xs font-medium text-gray-700">{c('activities.excursions.copy.places-of-visit.paragraph.hiking-95a7000a')}</p>
              <p className="text-[10px] text-gray-400">{c('activities.excursions.copy.places-of-visit.paragraph.outdoor-adventures-43b327ed')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-full bg-maroon-50 flex items-center justify-center mx-auto mb-1.5 text-maroon-700">
                <Camera size={14} />
              </div>
              <p className="text-xs font-medium text-gray-700">{c('activities.excursions.copy.places-of-visit.paragraph.learning-8b45bb20')}</p>
              <p className="text-[10px] text-gray-400">{c('activities.excursions.copy.places-of-visit.paragraph.practical-exposure-14ac50a9')}</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center p-3 bg-gold-50 rounded-lg border border-gold-200">
            <p className="text-xs text-maroon-800 flex items-center justify-center gap-2">
              <Compass size={14} className="text-gold-600" />
              <span>{c('activities.excursions.copy.places-of-visit.text.educational-visits-provide-28e815ae')}</span>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}

export default EducationalVisits
