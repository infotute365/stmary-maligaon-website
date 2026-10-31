import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React, { useState } from 'react'
import { 
  Users, 
  Rocket, 
  Leaf, 
  BookOpen, 
  Camera, 
  Music, 
  Disc,
  Heart,
  Award,
  Globe,
  Mic,
  Shield,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'

const Clubs = () => {
  const c = useSiteContent()
  const [expandedClub, setExpandedClub] = useState(null)

  const toggleClub = (clubName) => {
    if (expandedClub === clubName) {
      setExpandedClub(null)
    } else {
      setExpandedClub(clubName)
    }
  }

  const clubsData = [
    {
      id: 'guides',
      name: c('activities.clubs.clubsData.guides-9893ff99.name'),
      icon: <Heart size={18} />,
      color: 'blue',
      incharge: c('activities.clubs.clubsData.guides-9893ff99.incharge'),
      description: c('activities.clubs.clubsData.guides-9893ff99.description'),
      details: [
        { contentId: "Guides are prepared for Governor's Award & President's Award within a span of four years of training", text: c('activities.clubs.clubsData.guides-9893ff99.details.guides-are-prepared-for-governor-s-a-709dfad4') },
        { contentId: "Prepared for Regional, National & International Events", text: c('activities.clubs.clubsData.guides-9893ff99.details.prepared-for-regional-national-inter-f20fbcfd') },
        { contentId: "Presently, about 30 Volunteers from classes 4 to 10", text: c('activities.clubs.clubsData.guides-9893ff99.details.presently-about-30-volunteers-from-c-39e91b3d') },
        { contentId: "Several students have been awarded with the Governor's Award", text: c('activities.clubs.clubsData.guides-9893ff99.details.several-students-have-been-awarded-w-d4ce7508') },
        { contentId: "Tasks include: making an illiterate literate, volunteer service at charitable institutions", text: c('activities.clubs.clubsData.guides-9893ff99.details.tasks-include-making-an-illiterate-l-7858896e') },
        { contentId: "Visits to children wards and old people's wards at Guwahati Medical College Hospital", text: c('activities.clubs.clubsData.guides-9893ff99.details.visits-to-children-wards-and-old-peo-5bdad552') },
        { contentId: "Forming Peace Committees, visiting slum/poor areas and forming social action projects", text: c('activities.clubs.clubsData.guides-9893ff99.details.forming-peace-committees-visiting-sl-0c0d1da9') },
        { contentId: "Take part in school functions: Independence Day, Republic Day, Sports' Day, Inter School Competitions", text: c('activities.clubs.clubsData.guides-9893ff99.details.take-part-in-school-functions-indepe-03e474da') }
      ]
    },
    {
      id: 'vides',
      name: c('activities.clubs.clubsData.vides-c1c0714b.name'),
      icon: <Globe size={18} />,
      color: 'purple',
      incharge: c('activities.clubs.clubsData.vides-c1c0714b.incharge'),
      description: c('activities.clubs.clubsData.vides-c1c0714b.description'),
      members: [{ contentId: "Miss Richa Sharma", text: c('activities.clubs.clubsData.vides-c1c0714b.members.miss-richa-sharma-6051294c') }, { contentId: "Miss Panchali Das", text: c('activities.clubs.clubsData.vides-c1c0714b.members.miss-panchali-das-4abb5eb9') }, { contentId: "Mrs. Bornali Saikia", text: c('activities.clubs.clubsData.vides-c1c0714b.members.mrs-bornali-saikia-01bf566a') }, { contentId: "Miss Basabi Chanda", text: c('activities.clubs.clubsData.vides-c1c0714b.members.miss-basabi-chanda-81db71c8') }, { contentId: "Mrs. Nilotpala Sarma", text: c('activities.clubs.clubsData.vides-c1c0714b.members.mrs-nilotpala-sarma-9e610dbe') }, { contentId: "Mrs Mousumi Das", text: c('activities.clubs.clubsData.vides-c1c0714b.members.mrs-mousumi-das-09112a9c') }],
      objectives: [
        { contentId: "To create a declaration of Human Right", text: c('activities.clubs.clubsData.vides-c1c0714b.objectives.to-create-a-declaration-of-human-rig-830e908f') },
        { contentId: "To analyze the existing relation between Common Goods and Human Rights", text: c('activities.clubs.clubsData.vides-c1c0714b.objectives.to-analyze-the-existing-relation-bet-c3333c1b') },
        { contentId: "To deepen International and Church documents pertaining to Education, Human Rights and the Common Goods", text: c('activities.clubs.clubsData.vides-c1c0714b.objectives.to-deepen-international-and-church-d-be78640d') },
        { contentId: "To appreciate how the right to education serves the common good", text: c('activities.clubs.clubsData.vides-c1c0714b.objectives.to-appreciate-how-the-right-to-educa-e80b57a5') },
        { contentId: "To realize the importance of networking with GO's, NGO's, FBO's and PO's", text: c('activities.clubs.clubsData.vides-c1c0714b.objectives.to-realize-the-importance-of-network-6ef2a742') },
        { contentId: "To discover new ways that will strengthen and sustain the education of women and children", text: c('activities.clubs.clubsData.vides-c1c0714b.objectives.to-discover-new-ways-that-will-stren-4e31aedc') },
        { contentId: "To intensify our commitment to the education of women and children", text: c('activities.clubs.clubsData.vides-c1c0714b.objectives.to-intensify-our-commitment-to-the-e-e7dc48cc') },
        { contentId: "To share local and international initiatives of VIDES for the education of women and children", text: c('activities.clubs.clubsData.vides-c1c0714b.objectives.to-share-local-and-international-ini-452267dc') }
      ],
      activities: [
        { contentId: "Rendering economic aid to the poor in need", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.rendering-economic-aid-to-the-poor-i-9fb5f019') },
        { contentId: "Providing food items (Rice, Dal, Sugar, Refined oil etc.)", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.providing-food-items-rice-dal-sugar-f1cfff61') },
        { contentId: "Providing books, School fees to the poor", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.providing-books-school-fees-to-the-p-2c54686d') },
        { contentId: "Adoption of children", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.adoption-of-children-977fed53') },
        { contentId: "Conducting various talents competitions and celebrating important days with the poor", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.conducting-various-talents-competiti-e5fb0b84') },
        { contentId: "Training of different teaching skills", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.training-of-different-teaching-skill-3f6bee4b') },
        { contentId: "Evening coaching centers", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.evening-coaching-centers-708c7741') },
        { contentId: "Special attention to the weak students", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.special-attention-to-the-weak-studen-2f899b31') },
        { contentId: "Each one teaches one", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.each-one-teaches-one-41049d66') },
        { contentId: "Scholarship for poor children", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.scholarship-for-poor-children-0ba99fb2') },
        { contentId: "To give awareness for higher class studies to the students", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.to-give-awareness-for-higher-class-s-17028cbe') },
        { contentId: "Encouraging the students for their better academic performance by giving prizes", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.encouraging-the-students-for-their-b-2b2e6bab') },
        { contentId: "Conducting computer class", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.conducting-computer-class-dbd13c0d') },
        { contentId: "Literacy programme for the Self Help Group", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.literacy-programme-for-the-self-help-1e70b81e') },
        { contentId: "Awareness programmes for women on Empowerment and Human Rights", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.awareness-programmes-for-women-on-em-7ddbc3e9') },
        { contentId: "Providing help to start small-scale business to women", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.providing-help-to-start-small-scale-c0d04833') },
        { contentId: "Celebration of women's day", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.celebration-of-women-s-day-c6c8dac5') },
        { contentId: "Self Help Group to stand on their own feet", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.self-help-group-to-stand-on-their-ow-7d1a0eb0') },
        { contentId: "Awareness about all forms of violence against woman lobbying for necessary legal procedures", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.awareness-about-all-forms-of-violenc-766ad599') },
        { contentId: "Gender based violence awareness", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.gender-based-violence-awareness-77216567') },
        { contentId: "Encouraging Self-help Group, self-employment and income generating programmes", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.encouraging-self-help-group-self-emp-b98ab536') },
        { contentId: "Adult Education and leadership training for women", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.adult-education-and-leadership-train-e0599140') },
        { contentId: "Awareness programmes for mothers on child care", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.awareness-programmes-for-mothers-on-bf0c39ac') },
        { contentId: "Awareness programmes for unwed mothers on the evil of abortion and female infanticide", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.awareness-programmes-for-unwed-mothe-7dc84118') },
        { contentId: "Awareness about healthy Food habits to mothers", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.awareness-about-healthy-food-habits-db20206f') },
        { contentId: "Awareness programme on media especially good and bad", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.awareness-programme-on-media-especia-b4742817') },
        { contentId: "Medical camp in the villages", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.medical-camp-in-the-villages-364c2a90') },
        { contentId: "Awareness programmes on HIV/AIDS", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.awareness-programmes-on-hiv-aids-c827d749') },
        { contentId: "Conducting awareness programmes on various issues especially cleanliness of the environment", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.conducting-awareness-programmes-on-v-8057940a') },
        { contentId: "Awareness programme for health and hygiene", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.awareness-programme-for-health-and-h-16eb540c') },
        { contentId: "Raising financial help for major surgeries like Kidney transplant, bypass heart surgery etc.", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.raising-financial-help-for-major-sur-03d9faba') },
        { contentId: "Keeping environment clean", text: c('activities.clubs.clubsData.vides-c1c0714b.activities.keeping-environment-clean-673bfade') }
      ]
    },
    {
      id: 'media',
      name: c('activities.clubs.clubsData.media-721c9525.name'),
      icon: <Camera size={18} />,
      color: 'red',
      incharge: c('activities.clubs.clubsData.media-721c9525.incharge')
    },
    {
      id: 'eco',
      name: c('activities.clubs.clubsData.eco-8756de78.name'),
      icon: <Leaf size={18} />,
      color: 'green',
      incharge: c('activities.clubs.clubsData.eco-8756de78.incharge'),
      objectives: [
        { contentId: "To be aware of our surroundings", text: c('activities.clubs.clubsData.eco-8756de78.objectives.to-be-aware-of-our-surroundings-bf38d7a8') },
        { contentId: "To be sensitive about the environment", text: c('activities.clubs.clubsData.eco-8756de78.objectives.to-be-sensitive-about-the-environmen-b33fb885') },
        { contentId: "To have knowledge about the environmental problems", text: c('activities.clubs.clubsData.eco-8756de78.objectives.to-have-knowledge-about-the-environm-7567c6ba') },
        { contentId: "To develop activities through projects, group discussions etc. Through this activity they will motivate all the students to make use of cloth bags instead of polythene bags", text: c('activities.clubs.clubsData.eco-8756de78.objectives.to-develop-activities-through-projec-1da8e638') },
        { contentId: "To motivate the students to preserve and protect the environment in all possible ways", text: c('activities.clubs.clubsData.eco-8756de78.objectives.to-motivate-the-students-to-preserve-798eadea') }
      ]
    },
    {
      id: 'literature',
      name: c('activities.clubs.clubsData.literature-ac9fa250.name'),
      icon: <BookOpen size={18} />,
      color: 'amber',
      incharge: c('activities.clubs.clubsData.literature-ac9fa250.incharge')
    },
    {
      id: 'band',
      name: c('activities.clubs.clubsData.band-65f15ce8.name'),
      icon: <Music size={18} />,
      color: 'indigo',
      incharge: c('activities.clubs.clubsData.band-65f15ce8.incharge')
    },
    {
      id: 'vocal',
      name: c('activities.clubs.clubsData.vocal-96a6b83f.name'),
      icon: <Mic size={18} />,
      color: 'pink',
      incharge: c('activities.clubs.clubsData.vocal-96a6b83f.incharge')
    },
    {
      id: 'instrumental',
      name: c('activities.clubs.clubsData.instrumental-32528ed2.name'),
      icon: <Disc size={18} />,
      color: 'teal',
      incharge: c('activities.clubs.clubsData.instrumental-32528ed2.incharge')
    },
    {
      id: 'dance',
      name: c('activities.clubs.clubsData.dance-2c371c2a.name'),
      icon: <Sparkles size={18} />,
      color: 'rose',
      incharge: c('activities.clubs.clubsData.dance-2c371c2a.incharge')
    },
    {
      id: 'karate',
      name: c('activities.clubs.clubsData.karate-debee2ea.name'),
      icon: <Shield size={18} />,
      color: 'orange',
      incharge: c('activities.clubs.clubsData.karate-debee2ea.incharge')
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600',
        text: 'text-blue-700',
        gradient: 'from-blue-50 to-indigo-50',
        hover: 'hover:border-blue-300'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600',
        text: 'text-purple-700',
        gradient: 'from-purple-50 to-violet-50',
        hover: 'hover:border-purple-300'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconText: 'text-red-600',
        text: 'text-red-700',
        gradient: 'from-red-50 to-rose-50',
        hover: 'hover:border-red-300'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        iconBg: 'bg-green-100',
        iconText: 'text-green-600',
        text: 'text-green-700',
        gradient: 'from-green-50 to-emerald-50',
        hover: 'hover:border-green-300'
      },
      amber: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconText: 'text-amber-600',
        text: 'text-amber-700',
        gradient: 'from-amber-50 to-yellow-50',
        hover: 'hover:border-amber-300'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        iconBg: 'bg-indigo-100',
        iconText: 'text-indigo-600',
        text: 'text-indigo-700',
        gradient: 'from-indigo-50 to-purple-50',
        hover: 'hover:border-indigo-300'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        iconBg: 'bg-pink-100',
        iconText: 'text-pink-600',
        text: 'text-pink-700',
        gradient: 'from-pink-50 to-rose-50',
        hover: 'hover:border-pink-300'
      },
      teal: {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        iconBg: 'bg-teal-100',
        iconText: 'text-teal-600',
        text: 'text-teal-700',
        gradient: 'from-teal-50 to-cyan-50',
        hover: 'hover:border-teal-300'
      },
      rose: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        iconBg: 'bg-rose-100',
        iconText: 'text-rose-600',
        text: 'text-rose-700',
        gradient: 'from-rose-50 to-pink-50',
        hover: 'hover:border-rose-300'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-600',
        text: 'text-orange-700',
        gradient: 'from-orange-50 to-amber-50',
        hover: 'hover:border-orange-300'
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
              <Users size={20} className="text-gold-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{c('activities.clubs.copy.clubs-and-associations.heading.clubs-and-associations-583f9046')}</h1>
              <p className="text-sm text-gold-300/80 mt-0.5">{c('activities.clubs.copy.clubs-and-associations.paragraph.explore-interests-beyond-a-9e82175b')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <section className="section-padding">
        <div className="container-custom max-w-5xl mx-auto">

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubsData.map((club) => {
              const colors = getColorClasses(club.color)
              const isExpanded = expandedClub === club.id
              const hasDetails = club.details || club.objectives || club.activities || club.members

              return (
                <div 
                  key={club.id}
                  className={`bg-white rounded-2xl shadow-sm border ${colors.border} ${colors.hover} transition-all duration-300 overflow-hidden`}
                >
                  {/* Club Header - Clickable */}
                  <div 
                    className={`p-4 cursor-pointer transition-colors duration-200 ${colors.bg}`}
                    onClick={() => hasDetails && toggleClub(club.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 mt-0.5 ${colors.iconBg} rounded-xl p-2.5`}>
                          <div className={colors.iconText}>
                            {club.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${colors.text}`}>{club.name}</h3>
                          {club.incharge && (
                            <p className="text-xs text-gray-500 mt-0.5">{c('activities.clubs.copy.clubs-and-associations.paragraph.in-charge-32d80301') + ' '}{club.incharge}</p>
                          )}
                        </div>
                      </div>
                      {hasDetails && (
                        <div className="flex-shrink-0 mt-1">
                          {isExpanded ? (
                            <ChevronUp size={18} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={18} className="text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expandable Content */}
                  {isExpanded && hasDetails && (
                    <div className="p-4 border-t border-gray-100 space-y-3 max-h-[400px] overflow-y-auto">
                      {club.description && (
                        <p className="text-xs text-gray-600 leading-relaxed">{club.description}</p>
                      )}

                      {club.members && (
                        <div>
                          <h4 className="text-xs font-semibold text-maroon-800 mb-1">{c('activities.clubs.copy.members.heading.members-4f5cfa63')}</h4>
                          <div className="flex flex-wrap gap-1">
                            {club.members.map((member) => (
                              <span key={member.contentId} className="text-xs bg-gray-50 px-2 py-0.5 rounded-full text-gray-600">
                                {member.text}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {club.details && (
                        <div>
                          <h4 className="text-xs font-semibold text-maroon-800 mb-1">{c('activities.clubs.copy.details.heading.details-a4a61b7a')}</h4>
                          <ul className="space-y-0.5">
                            {club.details.map((item) => (
                              <li key={item.contentId} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className="text-gold-500">•</span>
                                {item.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {club.objectives && (
                        <div>
                          <h4 className="text-xs font-semibold text-maroon-800 mb-1">{c('activities.clubs.copy.objectives.heading.objectives-03c92e40')}</h4>
                          <ul className="space-y-0.5">
                            {club.objectives.map((item) => (
                              <li key={item.contentId} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className="text-gold-500">•</span>
                                {item.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {club.activities && (
                        <div>
                          <h4 className="text-xs font-semibold text-maroon-800 mb-1">{c('activities.clubs.copy.activities.heading.activities-e49ae437')}</h4>
                          <ul className="space-y-0.5">
                            {club.activities.map((item) => (
                              <li key={item.contentId} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className="text-gold-500">•</span>
                                {item.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center p-3 bg-gold-50 rounded-lg border border-gold-200">
            <p className="text-xs text-maroon-800 flex items-center justify-center gap-2">
              <Award size={14} className="text-gold-600" />
              <span>{c('activities.clubs.copy.activities.text.all-clubs-and-associations-20248a1e')}</span>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Clubs