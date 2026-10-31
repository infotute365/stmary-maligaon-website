import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react'
import { Link } from '@/routing'
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  const c = useSiteContent()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-maroon-950 text-maroon-100">
      <div className="container-custom py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Column 1 - School Info */}
        <div>
          <h3 className="font-serif text-xl font-bold text-white mb-3">{c('global.footer.st-mary-s-senior-secondary-school')}</h3>
          <p className="text-sm text-maroon-300 leading-relaxed">{c('global.footer.maligaon-guwahati-assam-nurturing-minds-and-building-character-si')}</p>
          <p className="text-sm text-maroon-400 mt-2 leading-relaxed">{c('global.footer.st-mary-s-senior-secondary-school-maligaon-is-an-english-medium-s')}</p>
          <div className="flex gap-3 mt-4">
            <a href={c('global.footer.facebookUrl')} aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-400 hover:text-maroon-900 transition-colors">
              <Facebook size={16} />
            </a>
            <a href={c('global.footer.instagramUrl')} aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-400 hover:text-maroon-900 transition-colors">
              <Instagram size={16} />
            </a>
            <a href={c('global.footer.youtubeUrl')} aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-400 hover:text-maroon-900 transition-colors">
              <Youtube size={16} />
            </a>
          </div>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h4 className="font-semibold text-gold-300 mb-3 text-sm tracking-wide uppercase">{c('global.footer.quick-links')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href={"/about/history"} className="hover:text-gold-300 transition-colors">{c('global.footer.about-us')}</Link></li>
            <li><Link href={"/administration/staff"} className="hover:text-gold-300 transition-colors">{c('global.footer.staff')}</Link></li>
            <li><Link href={"/students/fees"} className="hover:text-gold-300 transition-colors">{c('global.footer.fees')}</Link></li>
            <li><Link href={"/downloads"} className="hover:text-gold-300 transition-colors">{c('global.footer.downloads')}</Link></li>
            <li><Link href={"/gallery"} className="hover:text-gold-300 transition-colors">{c('global.footer.gallery')}</Link></li>
          </ul>
        </div>

        {/* Column 3 - CBSE Info */}
        <div>
          <h4 className="font-semibold text-gold-300 mb-3 text-sm tracking-wide uppercase">{c('global.footer.cbse-info')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href={"/cbse/mandatory-public-disclosure"} className="hover:text-gold-300 transition-colors">{c('global.footer.mandatory-public-disclosure')}</Link></li>
            <li><Link href={"/cbse/school-info"} className="hover:text-gold-300 transition-colors">{c('global.footer.school-information')}</Link></li>
            <li><Link href={"/students/examination"} className="hover:text-gold-300 transition-colors">{c('global.footer.examination')}</Link></li>
            <li><Link href={"/students/rules"} className="hover:text-gold-300 transition-colors">{c('global.footer.rules')}</Link></li>
          </ul>
        </div>

        {/* Column 4 - Contact */}
        <div>
          <h4 className="font-semibold text-gold-300 mb-3 text-sm tracking-wide uppercase">{c('global.footer.contact')}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
              <span>{c('global.footer.st-mary-s-senior-secondary-school-maligaon-nambari-guwahati-78101')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-gold-400 flex-shrink-0" />
              <span>{c('global.footer.87520-16092')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-gold-400 flex-shrink-0" />
              <span>{c('global.footer.st-marysschool66-yahoo-com')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar - with real credit line */}
      <div className="border-t border-white/10 py-4">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-maroon-300">
          <span>
            © {currentYear}{' ' + c('global.footer.st-mary-s-sr-sec-school-all-rights-reserved')}</span>
          <span>{c('global.footer.designed-by') + ' '}<span className="text-gold-400 font-medium">{c('global.footer.apexaspire')}</span>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer