import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react'
import { 
  Palette, 
  Music, 
  Mic2, 
  Brush, 
  Users, 
  Trophy, 
  BookOpen,
  Award,
  Star,
  Heart,
  Shield,
  Sparkles,
  Feather,
  Zap,
  Crown
} from 'lucide-react'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'

const CoCurricular = () => {
  const c = useSiteContent()
  const houses = [
    { contentId: "Red House",
      name: c('activities.coCurricular.houses.red-house-0028264c.name'),
      patron: c('activities.coCurricular.houses.red-house-0028264c.patron'),
      motto: c('activities.coCurricular.houses.red-house-0028264c.motto'),
      color: 'red',
      icon: <Heart size={16} />
    },
    { contentId: "Blue House",
      name: c('activities.coCurricular.houses.blue-house-83044ad3.name'),
      patron: c('activities.coCurricular.houses.blue-house-83044ad3.patron'),
      motto: c('activities.coCurricular.houses.blue-house-83044ad3.motto'),
      color: 'blue',
      icon: <Star size={16} />
    },
    { contentId: "Green House",
      name: c('activities.coCurricular.houses.green-house-d6f43408.name'),
      patron: c('activities.coCurricular.houses.green-house-d6f43408.patron'),
      motto: c('activities.coCurricular.houses.green-house-d6f43408.motto'),
      color: 'green',
      icon: <Shield size={16} />
    },
    { contentId: "Yellow House",
      name: c('activities.coCurricular.houses.yellow-house-c5b23912.name'),
      patron: c('activities.coCurricular.houses.yellow-house-c5b23912.patron'),
      motto: c('activities.coCurricular.houses.yellow-house-c5b23912.motto'),
      color: 'yellow',
      icon: <Sparkles size={16} />
    }
  ]

  const activities = [
    { contentId: "Painting & Drawing", icon: <Palette size={16} />, name: c('activities.coCurricular.activities.painting-drawing-fa8dd38f.name') },
    { contentId: "Flower Arrangement", icon: <Brush size={16} />, name: c('activities.coCurricular.activities.flower-arrangement-1cc3b57e.name') },
    { contentId: "Singing & Dance", icon: <Music size={16} />, name: c('activities.coCurricular.activities.singing-dance-e78b0649.name') },
    { contentId: "Elocution & Debate", icon: <Mic2 size={16} />, name: c('activities.coCurricular.activities.elocution-debate-2817d66a.name') },
    { contentId: "Creative Writing", icon: <Feather size={16} />, name: c('activities.coCurricular.activities.creative-writing-b0d3f114.name') },
    { contentId: "Quiz Sessions", icon: <Zap size={16} />, name: c('activities.coCurricular.activities.quiz-sessions-27d95c81.name') },
    { contentId: "One-act Play", icon: <Crown size={16} />, name: c('activities.coCurricular.activities.one-act-play-f28d39a5.name') },
    { contentId: "Theatre", icon: <BookOpen size={16} />, name: c('activities.coCurricular.activities.theatre-3248c256.name') }
  ]

  const clubs = [{ contentId: "Guide", text: c('activities.coCurricular.clubs.guide-8dd65d09') }, { contentId: "Red Cross", text: c('activities.coCurricular.clubs.red-cross-3a660f98') }, { contentId: "Media Smart Club", text: c('activities.coCurricular.clubs.media-smart-club-9e3445aa') }]

  const getColorClasses = (color) => {
    const colors = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconText: 'text-red-600',
        text: 'text-red-700',
        gradient: 'from-red-50 to-rose-50'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600',
        text: 'text-blue-700',
        gradient: 'from-blue-50 to-indigo-50'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        iconBg: 'bg-green-100',
        iconText: 'text-green-600',
        text: 'text-green-700',
        gradient: 'from-green-50 to-emerald-50'
      },
      yellow: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconText: 'text-amber-600',
        text: 'text-amber-700',
        gradient: 'from-amber-50 to-yellow-50'
      }
    }
    return colors[color] || colors.blue
  }

  return (
    <div>
      {/* Page Header without breadcrumb */}
      <div className="bg-gradient-to-r from-maroon-900 to-maroon-700 text-white py-6 px-4">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-500/20 rounded-lg">
              <Palette size={20} className="text-gold-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{c('activities.coCurricular.copy.co-curricular-activiti.heading.co-curricular-activities-56726c38')}</h1>
              <p className="text-sm text-gold-300/80 mt-0.5">{c('activities.coCurricular.copy.co-curricular-activiti.paragraph.beyond-the-classroom-424d0c0d')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <section className="section-padding">
        <div className="container-custom max-w-5xl mx-auto">

          {/* Introduction */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2 rounded-xl bg-purple-100">
                  <Sparkles size={18} className="text-purple-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">{c('activities.coCurricular.copy.co-curricular-activiti.paragraph.opportunities-galore-for-t-7bc1d674')}</p>
              </div>
            </div>
          </div>

          {/* Clubs */}
          <div className="mb-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-3 flex items-center gap-2">
              <Users size={18} className="text-gold-600" />{c('activities.coCurricular.copy.clubs.heading.clubs-98348a90')}</h2>
            <div className="grid grid-cols-3 gap-3">
              {clubs.map((club) => (
                <div key={club.contentId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center hover:shadow-md transition-shadow hover:border-gold-300">
                  <p className="text-sm font-medium text-maroon-800">{club.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activities Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-3 flex items-center gap-2">
              <Award size={18} className="text-gold-600" />{c('activities.coCurricular.copy.skill-honing-activitie.heading.skill-honing-activities-556e1f4e')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activities.map((activity) => (
                <div 
                  key={activity.contentId}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center hover:shadow-md transition-shadow hover:border-gold-300 hover:-translate-y-0.5 duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-maroon-50 flex items-center justify-center mx-auto mb-1.5 text-maroon-700">
                    {activity.icon}
                  </div>
                  <p className="text-xs font-medium text-gray-700 leading-tight">{activity.name}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{c('activities.coCurricular.copy.skill-honing-activitie.paragraph.all-activities-are-under-t-6108895b')}</p>
          </div>

          {/* House System */}
          <div className="mb-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-3 flex items-center gap-2">
              <Trophy size={18} className="text-gold-600" />{c('activities.coCurricular.copy.house-system.heading.house-system-546aa9ac')}</h2>
            <p className="text-xs text-gray-600 mb-3">{c('activities.coCurricular.copy.house-system.paragraph.all-the-activities-of-the--ff568cec')}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {houses.map((house) => {
                const colors = getColorClasses(house.color)
                return (
                  <div 
                    key={house.contentId}
                    className={`${colors.bg} rounded-xl border ${colors.border} p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className={`${colors.iconBg} rounded-full p-2 inline-block mb-2`}>
                      <div className={colors.iconText}>
                        {house.icon}
                      </div>
                    </div>
                    <h4 className={`font-bold text-sm ${colors.text}`}>{house.name}</h4>
                    <p className="text-xs text-gray-600 mt-0.5 font-medium">{house.patron}</p>
                    <p className="text-xs text-gray-500 italic mt-1">"{house.motto}"</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* House System Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="font-semibold text-maroon-900 text-sm flex items-center gap-2 mb-2">
                <Users size={16} className="text-gold-600" />{c('activities.coCurricular.copy.house-leadership.heading.house-leadership-0412f4c4')}</h4>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600 mt-1.5 flex-shrink-0"></span>
                  <span>{c('activities.coCurricular.copy.house-leadership.text.each-house-is-guided-by-ca-9e73788f')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600 mt-1.5 flex-shrink-0"></span>
                  <span>{c('activities.coCurricular.copy.house-leadership.text.reward-and-punishment-by-m-b5b96d29')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600 mt-1.5 flex-shrink-0"></span>
                  <span>{c('activities.coCurricular.copy.house-leadership.text.competitions-encourage-eac-19342c1a')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="font-semibold text-maroon-900 text-sm flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-gold-600" />{c('activities.coCurricular.copy.activities-rewards.heading.activities-rewards-c83b3bc1')}</h4>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600 mt-1.5 flex-shrink-0"></span>
                  <span>{c('activities.coCurricular.copy.activities-rewards.text.quiz-competition-increases-14ff4e07')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600 mt-1.5 flex-shrink-0"></span>
                  <span>{c('activities.coCurricular.copy.activities-rewards.text.one-act-play-elocution-pai-2170374d')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600 mt-1.5 flex-shrink-0"></span>
                  <span>{c('activities.coCurricular.copy.activities-rewards.text.trophies-presented-to-winn-759da0c6')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Democratic System Note */}
          <div className="bg-gradient-to-r from-maroon-50 to-rose-50 rounded-2xl border border-maroon-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-1.5 rounded-lg bg-maroon-100">
                  <Crown size={16} className="text-maroon-600" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <span className="font-semibold text-maroon-800">{c('activities.coCurricular.copy.activities-rewards.text.democratic-system-5c15e6d4')}</span>{' ' + c('activities.coCurricular.copy.activities-rewards.paragraph.this-democratic-system-dra-a81fafe0')}</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">{c('activities.coCurricular.copy.activities-rewards.paragraph.all-activities-are-designe-85c1b1c5')}</p>
          </div>

        </div>
      </section>
    </div>
  )
}

export default CoCurricular
