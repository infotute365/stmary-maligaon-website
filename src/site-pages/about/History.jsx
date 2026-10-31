import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react';
// If you have a school image in your assets, uncomment and import:
// import schoolImage from '../../assets/school.jpg'; // Adjust path

const History = () => {
  const c = useSiteContent()
  // Data from the images
  const headmistresses = [
    { no: 1, name: c('about.history.headmistresses.1-6b86b273.name'), years: c('about.history.headmistresses.1-6b86b273.years') },
    { no: 2, name: c('about.history.headmistresses.2-d4735e3a.name'), years: c('about.history.headmistresses.2-d4735e3a.years') },
    { no: 3, name: c('about.history.headmistresses.3-4e074085.name'), years: c('about.history.headmistresses.3-4e074085.years') },
    { no: 4, name: c('about.history.headmistresses.4-4b227777.name'), years: c('about.history.headmistresses.4-4b227777.years') },
    { no: 5, name: c('about.history.headmistresses.5-ef2d127d.name'), years: c('about.history.headmistresses.5-ef2d127d.years') },
    { no: 6, name: c('about.history.headmistresses.6-e7f6c011.name'), years: c('about.history.headmistresses.6-e7f6c011.years') },
    { no: 7, name: c('about.history.headmistresses.7-7902699b.name'), years: c('about.history.headmistresses.7-7902699b.years') },
    { no: 8, name: c('about.history.headmistresses.8-2c624232.name'), years: c('about.history.headmistresses.8-2c624232.years') },
    { no: 9, name: c('about.history.headmistresses.9-19581e27.name'), years: c('about.history.headmistresses.9-19581e27.years') },
    { no: 10, name: c('about.history.headmistresses.10-4a44dc15.name'), years: c('about.history.headmistresses.10-4a44dc15.years') },
    { no: 11, name: c('about.history.headmistresses.11-4fc82b26.name'), years: c('about.history.headmistresses.11-4fc82b26.years') },
    { no: 12, name: c('about.history.headmistresses.12-6b51d431.name'), years: c('about.history.headmistresses.12-6b51d431.years') },
    { no: 13, name: c('about.history.headmistresses.13-3fdba35f.name'), years: c('about.history.headmistresses.13-3fdba35f.years') },
    { no: 14, name: c('about.history.headmistresses.14-8527a891.name'), years: c('about.history.headmistresses.14-8527a891.years') },
    { no: 15, name: c('about.history.headmistresses.15-e629fa65.name'), years: c('about.history.headmistresses.15-e629fa65.years') },
    { no: 16, name: c('about.history.headmistresses.16-b17ef6d1.name'), years: c('about.history.headmistresses.16-b17ef6d1.years') },
  ];

  const superiors = [
    { no: 1, name: c('about.history.superiors.1-6b86b273.name'), years: c('about.history.superiors.1-6b86b273.years') },
    { no: 2, name: c('about.history.superiors.2-d4735e3a.name'), years: c('about.history.superiors.2-d4735e3a.years') },
    { no: 3, name: c('about.history.superiors.3-4e074085.name'), years: c('about.history.superiors.3-4e074085.years') },
    { no: 4, name: c('about.history.superiors.4-4b227777.name'), years: c('about.history.superiors.4-4b227777.years') },
    { no: 5, name: c('about.history.superiors.5-ef2d127d.name'), years: c('about.history.superiors.5-ef2d127d.years') },
    { no: 6, name: c('about.history.superiors.6-e7f6c011.name'), years: c('about.history.superiors.6-e7f6c011.years') },
    { no: 7, name: c('about.history.superiors.7-7902699b.name'), years: c('about.history.superiors.7-7902699b.years') },
    { no: 8, name: c('about.history.superiors.8-2c624232.name'), years: c('about.history.superiors.8-2c624232.years') },
    { no: 9, name: c('about.history.superiors.9-19581e27.name'), years: c('about.history.superiors.9-19581e27.years') },
    { no: 10, name: c('about.history.superiors.10-4a44dc15.name'), years: c('about.history.superiors.10-4a44dc15.years') },
    { no: 11, name: c('about.history.superiors.11-4fc82b26.name'), years: c('about.history.superiors.11-4fc82b26.years') },
    { no: 12, name: c('about.history.superiors.12-6b51d431.name'), years: c('about.history.superiors.12-6b51d431.years') },
  ];

  return (
    <div>
      {/* Custom Header – no breadcrumbs */}
      <div className="bg-maroon-900 text-white py-12 px-4">
        <div className="container-custom mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">{c('about.history.copy.our-history.heading.our-history-59ab2712')}</h1>
          <p className="text-gold-300 text-lg mt-2">{c('about.history.copy.our-history.paragraph.a-brief-history-of-st-mary-30f19fce')}</p>
        </div>
      </div>

      {/* School Image – full width with overlay */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        {/* Replace src with your school image if available, or use a placeholder */}
        <img
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80"
          alt="St. Mary's School"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h2 className="text-white text-3xl md:text-5xl font-serif font-bold tracking-wide drop-shadow-lg">{c('about.history.copy.st-mary-s-english-high.heading.st-mary-s-english-high-sch-5d0607b5')}</h2>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          {/* History Text */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-10 border border-gray-100">
            <h2 className="font-serif text-3xl font-bold text-maroon-900 mb-6">{c('about.history.copy.our-journey.heading.our-journey-a8e21009')}</h2>

            <p className="text-gray-700 leading-relaxed mb-4">{c('about.history.copy.our-journey.paragraph.st-mary-s-primary-school-m-273b274d')}{' '}
              <strong>{c('about.history.copy.our-journey.text.january-10-eef69408')}<sup>{c('about.history.copy.our-journey.text.th-6bde0b83')}</sup>{' ' + c('about.history.copy.our-journey.text.1966-c00cf031')}</strong>{c('about.history.copy.our-journey.paragraph.the-sisters-and-teachers-c-d116633c')}</p>

            <h3 className="font-serif text-2xl font-bold text-maroon-800 mt-8 mb-4">{c('about.history.copy.upgrading-the-school.heading.upgrading-the-school-187807b8')}</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{c('about.history.copy.upgrading-the-school.paragraph.due-to-constant-pressure-f-848ff171') + ' '}<strong>{c('about.history.copy.upgrading-the-school.text.january-1988-4cee56aa')}</strong>{' ' + c('about.history.copy.upgrading-the-school.paragraph.class-viii-was-introduced--93b7d441') + ' '}<strong>{c('about.history.copy.upgrading-the-school.text.january-1991-e6eeb4b3')}</strong>{' ' + c('about.history.copy.upgrading-the-school.paragraph.the-school-became-a-full-f-70bcd865') + ' '}<strong>{c('about.history.copy.upgrading-the-school.text.1-6b86b273')}<sup>{c('about.history.copy.upgrading-the-school.text.st-56af4bde')}</sup>{' ' + c('about.history.copy.upgrading-the-school.text.april-1998-321b84de')}</strong>.
            </p>

            <h3 className="font-serif text-2xl font-bold text-maroon-800 mt-8 mb-4">{c('about.history.copy.affiliation-to-the-cen.heading.affiliation-to-the-central-d4b29c4f')}</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{c('about.history.copy.affiliation-to-the-cen.paragraph.as-per-the-continuous-requ-263f3965') + ' '}<strong>{c('about.history.copy.affiliation-to-the-cen.text.april-2011-81bedbed')}</strong>{' ' + c('about.history.copy.affiliation-to-the-cen.paragraph.the-school-was-affiliated--2c15a14d') + ' '}<strong>{c('about.history.copy.affiliation-to-the-cen.text.april-2013-e4f24ddc')}</strong>{c('about.history.copy.affiliation-to-the-cen.paragraph.at-present-there-are-127-s-54c2ffe1')}<strong>{' ' + c('about.history.copy.affiliation-to-the-cen.text.science-commerce-and-human-0d3e44c7')}</strong>.
            </p>
          </div>

          {/* Headmistresses / Principals Table */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100 mb-10">
            <h3 className="font-serif text-2xl font-bold text-maroon-900 mb-6 flex items-center">
              <span className="bg-gold-500 w-1 h-8 mr-3 rounded"></span>{c('about.history.copy.headmistresses-princip.heading.headmistresses-principals-55c6d996')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-maroon-800 text-white">
                    <th className="py-3 px-4 text-left font-semibold">{c('about.history.copy.headmistresses-princip.text.no-38178a20')}</th>
                    <th className="py-3 px-4 text-left font-semibold">{c('about.history.copy.headmistresses-princip.text.name-dcd1d522')}</th>
                    <th className="py-3 px-4 text-left font-semibold">{c('about.history.copy.headmistresses-princip.text.year-89f68325')}</th>
                  </tr>
                </thead>
                <tbody>
                  {headmistresses.map((item) => (
                    <tr key={item.no} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-700">{item.no}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-gray-600">{item.years}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Superiors Table */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
            <h3 className="font-serif text-2xl font-bold text-maroon-900 mb-6 flex items-center">
              <span className="bg-gold-500 w-1 h-8 mr-3 rounded"></span>{c('about.history.copy.superiors-who-guided-t.heading.superiors-who-guided-the-s-6e2a52c4')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-maroon-800 text-white">
                    <th className="py-3 px-4 text-left font-semibold">{c('about.history.copy.superiors-who-guided-t.text.no-38178a20')}</th>
                    <th className="py-3 px-4 text-left font-semibold">{c('about.history.copy.superiors-who-guided-t.text.name-dcd1d522')}</th>
                    <th className="py-3 px-4 text-left font-semibold">{c('about.history.copy.superiors-who-guided-t.text.year-89f68325')}</th>
                  </tr>
                </thead>
                <tbody>
                  {superiors.map((item) => (
                    <tr key={item.no} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-700">{item.no}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-gray-600">{item.years}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;