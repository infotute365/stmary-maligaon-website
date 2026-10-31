import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react';
import boscoImage from '../../assets/bosco.png'; // Adjust the path as needed

const Founder = () => {
  const c = useSiteContent()
  return (
    <div>
      {/* Custom Header – no breadcrumbs */}
      <div className="bg-maroon-900 text-white py-12 px-4">
        <div className="container-custom mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">{c('about.founder.copy.our-founder.heading.our-founder-8b80712b')}</h1>
          <p className="text-gold-300 text-lg mt-2">{c('about.founder.copy.our-founder.paragraph.don-bosco-the-great-modern-01d7353e')}</p>
          <p className="text-gray-300 text-sm mt-1">{c('about.founder.copy.our-founder.paragraph.life-sketch-of-don-bosco-90cc8ded')}</p>
        </div>
      </div>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              {/* Founder Profile */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <img
                  src={boscoImage.src}
                  alt="Don Bosco"
                  className="w-48 h-48 rounded-full object-cover shadow-lg flex-shrink-0 border-4 border-gold-500"
                />
                <div>
                  <h2 className="font-serif text-3xl font-bold text-maroon-900">{c('about.founder.copy.st-john-bosco.heading.st-john-bosco-d31e0620')}</h2>
                  <p className="text-gold-600 text-sm font-semibold mb-4">{c('about.founder.copy.st-john-bosco.paragraph.1815-1888-996df8a9')}</p>
                  <p className="text-gray-700 leading-relaxed">{c('about.founder.copy.st-john-bosco.paragraph.st-john-bosco-popularly-kn-ba91af3d')}</p>
                  <p className="text-gray-700 leading-relaxed mt-3">{c('about.founder.copy.st-john-bosco.paragraph.he-lost-his-father-at-the--31cbaad2')}{' '}
                    <span className="italic">{c('about.founder.copy.st-john-bosco.text.not-with-blows-but-with-lo-96597da9')}</span>{' ' + c('about.founder.copy.st-john-bosco.paragraph.that-was-the-goal-of-his-l-b696d281')}</p>
                </div>
              </div>

              {/* Educational Vision */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="font-serif text-2xl font-bold text-maroon-900 mb-4">{c('about.founder.copy.his-educational-vision.heading.his-educational-vision-57ae0709')}</h3>
                <p className="text-gray-700 leading-relaxed">{c('about.founder.copy.his-educational-vision.paragraph.don-bosco-was-an-education-6ca1c7fa')}{' '}
                  <strong>{c('about.founder.copy.his-educational-vision.text.reason-f81ab834')}</strong>, <strong>{c('about.founder.copy.his-educational-vision.text.religion-f8a52d21')}</strong>{' ' + c('about.founder.copy.his-educational-vision.paragraph.faith-in-god-and-7b75c119')}{' '}
                  <strong>{c('about.founder.copy.his-educational-vision.text.loving-kindness-6cfff4c1')}</strong>{c('about.founder.copy.his-educational-vision.paragraph.the-goal-is-integral-forma-9c00f183')}</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-gold-600 text-3xl mb-2">🧠</div>
                    <h4 className="font-semibold text-maroon-900">{c('about.founder.copy.reason.heading.reason-f81ab834')}</h4>
                    <p className="text-sm text-gray-600">{c('about.founder.copy.reason.paragraph.intellectual-formation-and-43dceafc')}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-gold-600 text-3xl mb-2">🙏</div>
                    <h4 className="font-semibold text-maroon-900">{c('about.founder.copy.religion.heading.religion-f8a52d21')}</h4>
                    <p className="text-sm text-gray-600">{c('about.founder.copy.religion.paragraph.faith-in-god-and-moral-val-2ae8039e')}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-gold-600 text-3xl mb-2">❤️</div>
                    <h4 className="font-semibold text-maroon-900">{c('about.founder.copy.loving-kindness.heading.loving-kindness-6cfff4c1')}</h4>
                    <p className="text-sm text-gray-600">{c('about.founder.copy.loving-kindness.paragraph.compassion-and-caring-rela-3ade949e')}</p>
                  </div>
                </div>
              </div>

              {/* Legacy */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="font-serif text-2xl font-bold text-maroon-900 mb-4">{c('about.founder.copy.his-legacy.heading.his-legacy-ebcadbec')}</h3>
                <p className="text-gray-700 leading-relaxed">{c('about.founder.copy.his-legacy.paragraph.blooming-in-spite-of-initi-cdf0288b')}</p>
                <p className="text-gray-700 leading-relaxed mt-3">{c('about.founder.copy.his-legacy.paragraph.today-don-bosco-s-unique-c-9e2db861')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Founder;