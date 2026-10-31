import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react';
import { Target, Eye, Sparkles } from 'lucide-react';

const MissionVision = () => {
  const c = useSiteContent()
  return (
    <div>
      {/* Custom Header – no breadcrumbs */}
      <div className="bg-maroon-900 text-white py-12 px-4">
        <div className="container-custom mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">{c('about.missionVision.copy.mission-vision.heading.mission-vision-c2280f8e')}</h1>
          <p className="text-gold-300 text-lg mt-2">{c('about.missionVision.copy.mission-vision.paragraph.inspired-by-the-salesian-s-e81bcf74')}</p>
        </div>
      </div>

      {/* Content */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gold-500 px-6 py-4 flex items-center gap-3">
                <Target className="text-maroon-900" size={24} />
                <h2 className="font-serif text-2xl font-bold text-maroon-900">{c('about.missionVision.copy.our-mission.heading.our-mission-15071e06')}</h2>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-700 leading-relaxed">{c('about.missionVision.copy.our-mission.paragraph.st-mary-s-school-maligaon--761c180b')}<strong className="text-maroon-800">{' ' + c('about.missionVision.copy.our-mission.text.reason-religion-and-loving-66d7bfa0')}</strong>{' ' + c('about.missionVision.copy.our-mission.paragraph.as-taught-by-st-john-bosco-004a394d')}</p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-maroon-800 px-6 py-4 flex items-center gap-3">
                <Eye className="text-gold-400" size={24} />
                <h2 className="font-serif text-2xl font-bold text-white">{c('about.missionVision.copy.our-vision.heading.our-vision-cd490348')}</h2>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-700 leading-relaxed">{c('about.missionVision.copy.our-vision.paragraph.we-envisage-our-students-t-2f9ceff6')}{' '}
                  <strong className="text-maroon-800">{c('about.missionVision.copy.our-vision.text.integrally-developed-young-b1fe6b99')}</strong>{' ' + c('about.missionVision.copy.our-vision.paragraph.who-will-be-agents-of-soci-bdbb7dab')}</p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <span className="bg-maroon-50 text-maroon-800 text-xs px-3 py-1 rounded-full">{c('about.missionVision.copy.our-vision.text.intellectually-enlightened-ccba0d7e')}</span>
                  <span className="bg-maroon-50 text-maroon-800 text-xs px-3 py-1 rounded-full">{c('about.missionVision.copy.our-vision.text.morally-upright-35684717')}</span>
                  <span className="bg-maroon-50 text-maroon-800 text-xs px-3 py-1 rounded-full">{c('about.missionVision.copy.our-vision.text.spiritually-oriented-96ade36c')}</span>
                  <span className="bg-maroon-50 text-maroon-800 text-xs px-3 py-1 rounded-full">{c('about.missionVision.copy.our-vision.text.emotionally-balanced-4c565318')}</span>
                  <span className="bg-maroon-50 text-maroon-800 text-xs px-3 py-1 rounded-full">{c('about.missionVision.copy.our-vision.text.socially-committed-577fba80')}</span>
                  <span className="bg-maroon-50 text-maroon-800 text-xs px-3 py-1 rounded-full">{c('about.missionVision.copy.our-vision.text.patriotic-441aa337')}</span>
                  <span className="bg-maroon-50 text-maroon-800 text-xs px-3 py-1 rounded-full">{c('about.missionVision.copy.our-vision.text.eco-friendly-2724a1e7')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Quote / Motto */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-white px-8 py-4 rounded-full shadow-lg border border-gold-200">
              <Sparkles className="inline text-gold-500 mr-2" size={20} />
              <span className="text-maroon-900 font-serif text-lg font-semibold">{c('about.missionVision.copy.our-vision.text.reason-religion-loving-kin-57a6f332')}</span>
              <Sparkles className="inline text-gold-500 ml-2" size={20} />
            </div>
            <p className="text-gray-500 text-sm mt-3 italic">{c('about.missionVision.copy.our-vision.paragraph.the-salesian-educational-p-93ee9329')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MissionVision;