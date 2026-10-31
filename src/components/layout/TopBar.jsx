import { useSiteContent } from '@/content/SiteContentProvider.jsx'
// src/components/layout/TopBar.jsx

import React from 'react'
import { Link } from '@/routing'
import { Phone, Mail, MapPin, LogIn } from 'lucide-react'

const TopBar = () => {
  const c = useSiteContent()
  return (
    <div className="bg-maroon-950 text-maroon-100 text-xs border-b border-maroon-800">
      <div className="container-custom px-4 sm:px-6 py-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          {/* Left: Contact Info */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-gold-400 flex-shrink-0" />
              <span className="hidden xs:inline">{c('global.school.address')}</span>
              <span className="xs:hidden">{c('global.topbar.maligaon-guwahati')}</span>
            </span>
            <span className="flex items-center gap-1">
              <Phone size={11} className="text-gold-400 flex-shrink-0" />
              {c('global.school.phone')}
            </span>
            <span className="flex items-center gap-1">
              <Mail size={11} className="text-gold-400 flex-shrink-0" />
              <span className="hidden sm:inline">{c('global.school.email')}</span>
              <span className="sm:hidden">{c('global.topbar.email')}</span>
            </span>
          </div>

          {/* Right: Affiliation + Login Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline text-gold-300 font-medium tracking-wide text-[9px] sm:text-[10px] whitespace-nowrap">{c('global.topbar.affiliated-to') + ' '}{c('global.school.affiliation')}{' ' + c('global.topbar.est') + ' '}{c('global.school.established')}
            </span>

            {/* Admin Login Button */}
            <Link
              href={"/admin/login"}
              className="inline-flex items-center gap-1 bg-gold-500 hover:bg-gold-400 text-maroon-900 font-medium px-3 py-1 rounded-full transition-all duration-300 text-[9px] sm:text-[10px] shadow-md hover:shadow-lg hover:scale-105"
            >
              <LogIn size={12} className="sm:size-12" />
              <span className="hidden xs:inline">{c('global.topbar.admin-login')}</span>
              <span className="xs:hidden">{c('global.topbar.login')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar