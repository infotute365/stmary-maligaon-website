import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react'
import { 
  Trophy, 
  Dumbbell, 
  Activity,
  Hand,
  Clock,
  Award,
  Users,
  Calendar,
  Circle
} from 'lucide-react'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'

const Sports = () => {
  const c = useSiteContent()
  const sports = [
    { contentId: "Basketball", name: c('activities.sports.sports.basketball-3530d180.name'), icon: <Activity size={16} /> },
    { contentId: "Handball", name: c('activities.sports.sports.handball-c56b9c5f.name'), icon: <Hand size={16} /> },
    { contentId: "Chess", name: c('activities.sports.sports.chess-c1aade82.name'), icon: <Circle size={16} /> },
    { contentId: "Carom", name: c('activities.sports.sports.carom-6c9c0498.name'), icon: <Dumbbell size={16} /> }
  ]

  return (
    <div>
      {/* Page Header without breadcrumb */}
      <div className="bg-gradient-to-r from-maroon-900 to-maroon-700 text-white py-6 px-4">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-500/20 rounded-lg">
              <Trophy size={20} className="text-gold-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{c('activities.sports.copy.sports-games.heading.sports-games-a88e7407')}</h1>
              <p className="text-sm text-gold-300/80 mt-0.5">{c('activities.sports.copy.sports-games.paragraph.building-fitness-teamwork--9c93a5a4')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">

          {/* Sports Overview */}
          <SectionWrapper className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-xl bg-maroon-50 flex items-center justify-center text-maroon-700">
                  <Dumbbell size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-serif font-bold text-maroon-900 text-sm">{c('activities.sports.copy.sports-program.heading.sports-program-2f7b60ce')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">{c('activities.sports.copy.sports-program.paragraph.every-class-has-one-period-0f4bf812')}</p>
              </div>
            </div>
          </SectionWrapper>

          {/* Sports Grid */}
          <h2 className="text-lg font-serif font-bold text-maroon-900 mb-3 flex items-center gap-2">
            <Award size={18} className="text-gold-600" />{c('activities.sports.copy.sports-offered.heading.sports-offered-490ac63d')}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {sports.map((sport) => (
              <div 
                key={sport.contentId}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300"
              >
                <div className="w-12 h-12 rounded-full bg-maroon-50 flex items-center justify-center mx-auto mb-2 text-maroon-700">
                  {sport.icon}
                </div>
                <p className="text-sm font-semibold text-gray-800">{sport.name}</p>
              </div>
            ))}
          </div>

          {/* Schedule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-blue-100">
                  <Clock size={16} className="text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-900 text-sm">{c('activities.sports.copy.physical-training.heading.physical-training-4146f578')}</h4>
              </div>
              <p className="text-xs text-gray-600">{c('activities.sports.copy.physical-training.paragraph.one-period-per-class-b612e561')}</p>
              <p className="text-xs text-gray-500 mt-1">{c('activities.sports.copy.physical-training.paragraph.fitness-conditioning-05df40a1')}</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-green-100">
                  <Users size={16} className="text-green-600" />
                </div>
                <h4 className="font-semibold text-green-900 text-sm">{c('activities.sports.copy.games-period.heading.games-period-660328f5')}</h4>
              </div>
              <p className="text-xs text-gray-600">{c('activities.sports.copy.games-period.paragraph.one-period-per-class-b612e561')}</p>
              <p className="text-xs text-gray-500 mt-1">{c('activities.sports.copy.games-period.paragraph.basketball-handball-chess--3df82f28')}</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-amber-100">
                  <Calendar size={16} className="text-amber-600" />
                </div>
                <h4 className="font-semibold text-amber-900 text-sm">{c('activities.sports.copy.after-class-coaching.heading.after-class-coaching-be2a568d')}</h4>
              </div>
              <p className="text-xs text-gray-600">{c('activities.sports.copy.after-class-coaching.paragraph.available-after-classes-e9b32171')}</p>
              <p className="text-xs text-gray-500 mt-1">{c('activities.sports.copy.after-class-coaching.paragraph.specialized-basket-ball-co-13424064')}</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center p-4 bg-gold-50 rounded-xl border border-gold-200">
            <p className="text-xs text-maroon-800 flex items-center justify-center gap-2">
              <Trophy size={14} className="text-gold-600" />
              <span>{c('activities.sports.copy.after-class-coaching.text.students-are-encouraged-to-ffa00c09')}</span>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Sports
