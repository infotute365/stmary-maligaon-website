import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react'
import { Bus, MapPin, ShieldCheck, Clock, Phone, User, Building, AlertCircle } from 'lucide-react'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'

const Transport = () => {
  const c = useSiteContent()
  const operators = [
    { contentId: "Mr. Babul Baishya", text: c('infrastructure.transport.operators.mr-babul-baishya-1c0975df') },
    { contentId: "Md. Babujan Mia", text: c('infrastructure.transport.operators.md-babujan-mia-d95533f3') },
    { contentId: "Mrs. Mary Sangma", text: c('infrastructure.transport.operators.mrs-mary-sangma-3ff20ce0') },
    { contentId: "Green Valley Pvt. Ltd.", text: c('infrastructure.transport.operators.green-valley-pvt-ltd-20e10ab4') }
  ]

  const vehicles = [
    {
      sl: 1,
      number: c('infrastructure.transport.vehicles.1-6b86b273.number'),
      owner: c('infrastructure.transport.vehicles.1-6b86b273.owner'),
      contact: c('infrastructure.transport.vehicles.1-6b86b273.contact'),
      route: c('infrastructure.transport.vehicles.1-6b86b273.route')
    }
  ]

  return (
    <div>
      {/* Page Header without breadcrumb */}
      <div className="bg-gradient-to-r from-maroon-900 to-maroon-700 text-white py-6 px-4">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-500/20 rounded-lg">
              <Bus size={20} className="text-gold-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{c('infrastructure.transport.copy.transport.heading.transport-aaead4ab')}</h1>
              <p className="text-sm text-gold-300/80 mt-0.5">{c('infrastructure.transport.copy.transport.paragraph.safe-and-reliable-school-t-0468b5b6')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <section className="section-padding">
        <div className="container-custom max-w-5xl mx-auto">

          {/* Authorized Operators Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800 flex items-start gap-2">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold">{c('infrastructure.transport.copy.transport.text.as-per-cbse-norms-a9b25e4c')}</span>{' ' + c('infrastructure.transport.copy.transport.text.the-school-has-authorized--ea989cd1')}</span>
            </p>
          </div>

          {/* Operators List */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {operators.map((operator, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center hover:shadow-md transition-shadow hover:border-gold-300"
              >
                <div className="w-8 h-8 rounded-full bg-maroon-50 flex items-center justify-center mx-auto mb-1.5">
                  <User size={14} className="text-maroon-700" />
                </div>
                <p className="text-xs font-medium text-gray-800 leading-tight">{operator.text}</p>
              </div>
            ))}
          </div>

          {/* Vehicle Details */}
          <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4 flex items-center gap-2">
            <Bus size={18} className="text-gold-600" />{c('infrastructure.transport.copy.authorized-vehicles.heading.authorized-vehicles-a8396403')}</h2>

          <SectionWrapper className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-maroon-800 text-white">
                    <th className="px-4 py-3 text-left font-semibold">{c('infrastructure.transport.copy.authorized-vehicles.text.sl-b6739935')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{c('infrastructure.transport.copy.authorized-vehicles.text.vehicle-number-57c8177a')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{c('infrastructure.transport.copy.authorized-vehicles.text.owner-4b1b8aa3')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{c('infrastructure.transport.copy.authorized-vehicles.text.contact-2b5c3d26')}</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.sl} className="hover:bg-maroon-50/30 transition-colors duration-150">
                      <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{vehicle.sl}</td>
                      <td className="px-4 py-3 font-medium text-maroon-900 border-b border-gray-100">
                        {vehicle.number}
                      </td>
                      <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{vehicle.owner}</td>
                      <td className="px-4 py-3 text-gray-600 border-b border-gray-100 flex items-center gap-1.5">
                        <Phone size={12} className="text-gold-600" />
                        {vehicle.contact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionWrapper>

          {/* Route Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2 rounded-xl bg-blue-100">
                  <MapPin size={18} className="text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">{c('infrastructure.transport.copy.route-details.heading.route-details-86a01c88')}</h4>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  <span className="font-medium">{c('infrastructure.transport.copy.route-details.text.vehicle-no-as01hc2324-cove-59ba07af')}</span> {vehicles[0].route}
                </p>
              </div>
            </div>
          </div>

          {/* Transport Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-800 flex items-center justify-center mx-auto mb-2.5">
                <MapPin size={20} />
              </div>
              <h4 className="font-serif font-bold text-maroon-900 text-sm">{c('infrastructure.transport.copy.wide-route-coverage.heading.wide-route-coverage-84a4f033')}</h4>
              <p className="text-gray-600 text-xs mt-1">{c('infrastructure.transport.copy.wide-route-coverage.paragraph.buses-cover-major-resident-b6077bb8')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-800 flex items-center justify-center mx-auto mb-2.5">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-serif font-bold text-maroon-900 text-sm">{c('infrastructure.transport.copy.safety-first.heading.safety-first-ca6141dc')}</h4>
              <p className="text-gray-600 text-xs mt-1">{c('infrastructure.transport.copy.safety-first.paragraph.gps-tracked-buses-with-tra-5ffac874')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-800 flex items-center justify-center mx-auto mb-2.5">
                <Clock size={20} />
              </div>
              <h4 className="font-serif font-bold text-maroon-900 text-sm">{c('infrastructure.transport.copy.punctual-timing.heading.punctual-timing-008fd822')}</h4>
              <p className="text-gray-600 text-xs mt-1">{c('infrastructure.transport.copy.punctual-timing.paragraph.fixed-pick-up-and-drop-off-dd26ccf9')}</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center p-3 bg-gold-50 rounded-lg border border-gold-200">
            <p className="text-xs text-maroon-800 flex items-center justify-center gap-2">
              <Building size={14} className="text-gold-600" />
              <span>{c('infrastructure.transport.copy.punctual-timing.text.for-route-details-and-tran-f825ee09')}</span>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Transport