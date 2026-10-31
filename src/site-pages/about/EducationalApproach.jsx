import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react';
import { BookOpen, Brain, Heart as HeartIcon, Sun, Users } from 'lucide-react';

const EducationalApproach = () => {
  const c = useSiteContent()
  return (
    <div>
      {/* Custom Header – no breadcrumbs */}
      <div className="bg-maroon-900 text-white py-12 px-4">
        <div className="container-custom mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">{c('about.educationalApproach.copy.our-educational-approa.heading.our-educational-approach-9ca03846')}</h1>
          <p className="text-gold-300 text-lg mt-2">{c('about.educationalApproach.copy.our-educational-approa.paragraph.the-salesian-preventive-sy-af1c164f')}</p>
        </div>
      </div>

      {/* Main content */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mb-10 border border-gray-100">
            <p className="text-gray-700 leading-relaxed text-lg">{c('about.educationalApproach.copy.our-educational-approa.paragraph.the-system-of-education-fo-e41d17ac')}{' '}
              <strong className="text-maroon-800">{c('about.educationalApproach.copy.our-educational-approa.text.preventive-system-6aad6029')}</strong>{' ' + c('about.educationalApproach.copy.our-educational-approa.paragraph.which-is-based-on-three-gr-4086c142')}{' '}
              <span className="font-semibold text-maroon-700">{c('about.educationalApproach.copy.our-educational-approa.text.reason-f81ab834')}</span>,{' '}
              <span className="font-semibold text-maroon-700">{c('about.educationalApproach.copy.our-educational-approa.text.religion-f8a52d21')}</span>{' ' + c('about.educationalApproach.copy.our-educational-approa.paragraph.and-6201111b')}{' '}
              <span className="font-semibold text-maroon-700">{c('about.educationalApproach.copy.our-educational-approa.text.loving-kindness-6cfff4c1')}</span>{' ' + c('about.educationalApproach.copy.our-educational-approa.paragraph.which-create-the-education-36fa39c5')}{' '}
              <strong className="text-maroon-800">{c('about.educationalApproach.copy.our-educational-approa.text.educating-community-648633a3')}</strong>{' ' + c('about.educationalApproach.copy.our-educational-approa.paragraph.whose-primary-aim-is-to-fo-2c6c24ec')}</p>
          </div>

          {/* Three Principles */}
          <div className="space-y-8">
            {/* Reason */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-50 px-6 py-4 flex items-center gap-3 border-b border-blue-100">
                <Brain className="text-blue-700" size={28} />
                <h2 className="font-serif text-2xl font-bold text-maroon-900">{c('about.educationalApproach.copy.reason.heading.reason-f81ab834')}</h2>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-700 leading-relaxed mb-4">{c('about.educationalApproach.copy.reason.paragraph.stands-for-a-wise-and-prog-2bfe3a96')}</p>
                <p className="text-gray-700 leading-relaxed">{c('about.educationalApproach.copy.reason.paragraph.in-dealing-with-the-young--4ec7e31b') + ' '}<strong>{c('about.educationalApproach.copy.reason.text.reasonableness-6e16096e')}</strong>{c('about.educationalApproach.copy.reason.paragraph.good-sense-simplicity-and--d52f7e06') + ' '}<strong>{c('about.educationalApproach.copy.reason.text.persuasiveness-60c41c21')}</strong>{' ' + c('about.educationalApproach.copy.reason.paragraph.and-6201111b')}{' '}
                  <strong>{c('about.educationalApproach.copy.reason.text.dialogue-abe0ba24')}</strong>{c('about.educationalApproach.copy.reason.paragraph.and-formation-of-the-consc-71e91761')}</p>
              </div>
            </div>

            {/* Religion */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-amber-50 px-6 py-4 flex items-center gap-3 border-b border-amber-100">
                <Sun className="text-amber-600" size={28} />
                <h2 className="font-serif text-2xl font-bold text-maroon-900">{c('about.educationalApproach.copy.religion.heading.religion-f8a52d21')}</h2>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-700 leading-relaxed">{c('about.educationalApproach.copy.religion.paragraph.provides-the-motivation-th-dbf29431')}</p>
              </div>
            </div>

            {/* Loving Kindness */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-rose-50 px-6 py-4 flex items-center gap-3 border-b border-rose-100">
                <HeartIcon className="text-rose-600" size={28} />
                <h2 className="font-serif text-2xl font-bold text-maroon-900">{c('about.educationalApproach.copy.loving-kindness.heading.loving-kindness-6cfff4c1')}</h2>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-700 leading-relaxed mb-4">{c('about.educationalApproach.copy.loving-kindness.paragraph.is-rooted-in-the-charity-o-4af03582')}</p>
                <p className="text-gray-700 leading-relaxed">{c('about.educationalApproach.copy.loving-kindness.paragraph.loving-kindness-in-order-t-10da9998')}{' '}
                  <span className="italic text-maroon-800 font-semibold">{c('about.educationalApproach.copy.loving-kindness.text.education-is-a-matter-of-t-ecbee72d')}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Motto / Quote */}
          <div className="mt-10 bg-maroon-800 text-white rounded-2xl p-6 md:p-8 text-center shadow-xl">
            <Users className="inline text-gold-400 mr-2" size={24} />
            <span className="font-serif text-xl font-semibold">{c('about.educationalApproach.copy.loving-kindness.text.the-educating-community-afc72b13')}</span>
            <p className="text-gray-300 mt-2 text-sm md:text-base">{c('about.educationalApproach.copy.loving-kindness.paragraph.sisters-teachers-parents-a-d83791bc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EducationalApproach;