import { useSiteContent } from '@/content/SiteContentProvider.jsx'
// src/components/layout/Navbar.jsx

import React, { useState } from 'react'
import { Link, NavLink } from '@/routing'
import { Menu, X } from 'lucide-react'
import NavDropdown from './NavDropdown.jsx'
import SchoolLogo from '../../assets/School_Logo.jpeg'

const Navbar = () => {
  const c = useSiteContent()
  const aboutItems = [
    { label: c('global.navigation.label1'), path: '/about/founder' },
    { label: c('global.navigation.label2'), path: '/about/co-founders' },
    { label: c('global.navigation.label3'), path: '/about/history' },
    { label: c('global.navigation.label4'), path: '/about/mission-vision' },
    { label: c('global.navigation.label5'), path: '/about/educational-approach' }
  ]

  const administrationItems = [
    { label: c('global.navigation.label6'), path: '/administration/management' },
    { label: c('global.navigation.label7'), path: '/administration/managing-committee' },
    { label: c('global.navigation.label8'), path: '/administration/staff' },
    { label: c('global.navigation.label9'), path: '/administration/teaching-staff' }
  ]

  const cbseItems = [
    { label: c('global.navigation.label10'), path: '/cbse/mandatory-public-disclosure' },
    { label: c('global.navigation.label11'), path: '/cbse/school-info' }
  ]

  const studentsItems = [
    { label: c('global.navigation.label12'), path: '/students/fees' },
    { label: c('global.navigation.label13'), path: '/students/rules' },
    { label: c('global.navigation.label14'), path: '/students/leave' },
    { label: c('global.navigation.label15'), path: '/students/examination' },
    { label: c('global.navigation.label16'), path: '/students/discipline' },
    { label: c('global.navigation.label17'), path: '/students/uniform' },
    { label: c('global.navigation.label18'), path: '/students/parents-notice-enrollment' }
  ]

  const activitiesItems = [
    { label: c('global.navigation.label19'), path: '/activities/co-curricular' },
    { label: c('global.navigation.label20'), path: '/activities/sports' },
    { label: c('global.navigation.label21'), path: '/activities/excursions' },
    { label: c('global.navigation.label22'), path: '/activities/clubs' }
  ]

  const simpleLinks = [
    { label: c('global.navigation.label23'), path: '/gallery' },
    { label: c('global.navigation.label24'), path: '/downloads' },
    { label: c('global.navigation.label25'), path: '/infrastructure/transport' },
    { label: c('global.navigation.label26'), path: '/contact-us' }
  ]


  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm w-full">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 w-full">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-3 flex-shrink-0">
          <img
            src={SchoolLogo.src}
            alt="School Logo"
            className="w-11 h-11 rounded-xl object-contain bg-maroon-800 p-1"
          />
          <span>
            <span className="block font-serif font-bold text-maroon-900 leading-tight text-sm sm:text-base">
              {c('global.school.name')}
            </span>
            <span className="block text-[10px] sm:text-xs text-gold-600 font-medium tracking-wide">
              {c('global.school.branch')}, {c('global.school.city')}
            </span>
          </span>
        </Link>

        {/* Desktop Navigation - Fixed: Added pb-4 to create bridge to dropdown */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-nowrap">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-2 xl:px-3 py-2 text-[12px] xl:text-sm font-medium transition-colors whitespace-nowrap ${
                isActive ? 'text-maroon-800' : 'text-maroon-900 hover:text-maroon-600'
              }`
            }
          >{c('global.navigation.home')}</NavLink>
          <NavDropdown label={c('global.navigation.about-us')} items={aboutItems} />
          <NavDropdown label={c('global.navigation.administration')} items={administrationItems} />
          <NavDropdown label={c('global.navigation.cbse-information')} items={cbseItems} />
          <NavDropdown label={c('global.navigation.students')} items={studentsItems} />
          <NavDropdown label={c('global.navigation.activities')} items={activitiesItems} />
          {simpleLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-2 xl:px-3 py-2 text-[12px] xl:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-maroon-800' : 'text-maroon-900 hover:text-maroon-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-maroon-900 flex-shrink-0"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 max-h-[75vh] overflow-y-auto w-full">
          {[
            { label: c('global.navigation.home'), path: '/' },
            ...aboutItems,
            ...administrationItems,
            ...cbseItems,
            ...studentsItems,
            ...activitiesItems,
            ...simpleLinks
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-maroon-50 hover:text-maroon-800"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-maroon-800 bg-gold-50"
          >{c('global.navigation.login')}</Link>
        </div>
      )}
    </header>
  )
}

export default Navbar