import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Quote, 
  Cross, 
  BookOpen, 
  Users, 
  Globe,
  Calendar,
  Award,
  Star
} from 'lucide-react';
import coFounderImage from '../../assets/coFounder.png';

const CoFounders = () => {
  const c = useSiteContent()
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-[#FBF6EC] min-h-screen overflow-hidden">
      
      {/* ========================================================== */}
      {/* HERO SECTION - Full width with parallax effect */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 py-20 md:py-28">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gold-400/20"
                style={{
                  width: Math.random() * 300 + 50 + 'px',
                  height: Math.random() * 300 + 50 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Decorative Gold Lines */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{ 
            y: [0, 30, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gold-400/20 backdrop-blur-sm border border-gold-400/30 text-gold-300 px-4 py-2 rounded-full text-sm font-semibold tracking-[0.2em] uppercase mb-6"
            >
              <Sparkles size={16} className="text-gold-400" />{c('about.coFounders.copy.page-header.text.our-founders-7ed63d30')}</motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >{c('about.coFounders.copy.page-header.text.our-1d20526a') + ' '}<span className="text-gold-400 italic">{c('about.coFounders.copy.page-header.text.co-foundress-f8005040')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-gold-300 text-xl md:text-2xl mt-4 font-light"
            >{c('about.coFounders.copy.page-header.text.st-mary-domenica-mazzarell-665fbc21')}</motion.p>

            {/* Years */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray-400 text-sm mt-2 tracking-widest flex items-center justify-center gap-2"
            >
              <Calendar size={16} className="text-gold-400" />{c('about.coFounders.copy.page-header.text.1837-1881-91b9cbb9')}</motion.p>

            {/* Decorative Divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '80px' }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="h-1 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full mx-auto mt-6"
            />
          </motion.div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================================== */}
      <section ref={ref} className="section-padding">
        <div className="container-custom">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate={controls}
            className="max-w-5xl mx-auto"
          >

            {/* ========================================================== */}
            {/* PROFILE CARD */}
            {/* ========================================================== */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100/80 hover:shadow-3xl transition-shadow duration-500"
            >
              <div className="p-8 md:p-10 lg:p-12">
                
                {/* Profile Section */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                  {/* Image Container */}
                  <motion.div
                    variants={fadeInScale}
                    className="relative flex-shrink-0 mx-auto md:mx-0"
                  >
                    <div className="relative">
                      {/* Gold Ring Animation */}
                      <motion.div
                        className="absolute -inset-2 rounded-full border-2 border-gold-400/30"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      
                      {/* Main Image */}
                      <img
                        src={coFounderImage.src}
                        alt="St. Mary Domenica Mazzarello"
                        className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-xl border-4 border-gold-400 relative z-10"
                      />
                      
                      {/* Decorative Corner Accents */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-gold-400 rounded-tr-xl z-20" />
                      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-gold-400 rounded-bl-xl z-20" />
                    </div>

                    {/* Saint Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -bottom-1 -right-1 bg-gold-500 text-maroon-900 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-20"
                    >
                      <Star size={14} className="fill-current" />
                      <span className="text-xs font-bold">{c('about.coFounders.copy.page-header.text.saint-4ab07918')}</span>
                    </motion.div>
                  </motion.div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left">
                    <motion.h2 
                      variants={fadeInUp}
                      className="font-serif text-3xl md:text-4xl font-bold text-maroon-900"
                    >{c('about.coFounders.copy.page-header.text.st-mary-domenica-154823dd') + ' '}<br className="hidden sm:block" />
                      <span className="text-gold-600">{c('about.coFounders.copy.page-header.text.mazzarello-f4f696aa')}</span>
                    </motion.h2>

                    <motion.p 
                      variants={fadeInUp}
                      className="text-gold-600 text-sm font-semibold mt-1 flex items-center justify-center md:justify-start gap-2"
                    >
                      <Award size={16} />{c('about.coFounders.copy.page-header.text.co-foundress-of-the-salesi-a7808a8d')}</motion.p>

                    <motion.div 
                      variants={fadeInUp}
                      className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3"
                    >
                      <span className="inline-flex items-center gap-1.5 text-xs bg-maroon-50 text-maroon-700 px-3 py-1 rounded-full">
                        <Heart size={12} className="text-rose-500" />{c('about.coFounders.copy.page-header.text.born-may-9-1837-0781ad5e')}</span>
                      <span className="inline-flex items-center gap-1.5 text-xs bg-maroon-50 text-maroon-700 px-3 py-1 rounded-full">
                        <Cross size={12} className="text-gold-500" />{c('about.coFounders.copy.page-header.text.died-may-14-1881-82eb4323')}</span>
                    </motion.div>

                    {/* Quote from the Saint */}
                    <motion.div 
                      variants={fadeInUp}
                      className="mt-4 p-4 bg-gradient-to-r from-gold-50/80 to-transparent rounded-xl border-l-4 border-gold-400"
                    >
                      <Quote size={16} className="text-gold-400 mb-1" />
                      <p className="text-maroon-800 italic text-sm leading-relaxed">{c('about.coFounders.copy.page-header.paragraph.i-entrust-them-to-you-85d7e18f')}</p>
                    </motion.div>
                  </div>
                </div>

                {/* ========================================================== */}
                {/* BIOGRAPHY SECTION */}
                {/* ========================================================== */}
                <motion.div 
                  variants={fadeInUp}
                  className="mt-8 pt-8 border-t border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-maroon-100 text-maroon-700 flex items-center justify-center">
                      <BookOpen size={18} />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-maroon-900">{c('about.coFounders.copy.her-life-mission.heading.her-life-mission-879b07ee')}</h3>
                  </div>

                  <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
                    <p>
                      <span className="text-maroon-800 font-semibold">{c('about.coFounders.copy.her-life-mission.text.god-s-ways-are-marvelous-e2449398')}</span>{' ' + c('about.coFounders.copy.her-life-mission.paragraph.contemporary-with-don-bosc-7ce1947d')}<span className="text-maroon-700 font-medium">{' ' + c('about.coFounders.copy.her-life-mission.text.may-9-1837-e73c7da7')}</span>.
                    </p>

                    <p>{c('about.coFounders.copy.her-life-mission.paragraph.she-too-did-receive-a-heav-da84b0ca')}{' '}
                      <span className="italic text-maroon-800 font-medium">{c('about.coFounders.copy.her-life-mission.text.i-entrust-them-to-you-85d7e18f')}</span>{c('about.coFounders.copy.her-life-mission.paragraph.was-it-a-dream-a-hallucina-a2ef9141')}</p>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                      <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                        <p className="text-2xl font-bold text-maroon-900">{c('about.coFounders.copy.her-life-mission.paragraph.1837-3e8a9277')}</p>
                        <p className="text-xs text-gray-500">{c('about.coFounders.copy.her-life-mission.paragraph.birth-year-c7856ad3')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                        <p className="text-2xl font-bold text-maroon-900">{c('about.coFounders.copy.her-life-mission.paragraph.1872-3f613c55')}</p>
                        <p className="text-xs text-gray-500">{c('about.coFounders.copy.her-life-mission.paragraph.founded-fma-c5caaee6')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                        <p className="text-2xl font-bold text-maroon-900">{c('about.coFounders.copy.her-life-mission.paragraph.1922-2c1f3f5f')}</p>
                        <p className="text-xs text-gray-500">{c('about.coFounders.copy.her-life-mission.paragraph.arrived-in-india-f7d99d31')}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ========================================================== */}
                {/* MEETING WITH DON BOSCO */}
                {/* ========================================================== */}
                <motion.div 
                  variants={fadeInUp}
                  className="mt-8 pt-8 border-t border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gold-100 text-gold-700 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-maroon-900">{c('about.coFounders.copy.the-meeting-foundation.heading.the-meeting-foundation-76a4d737')}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
                      <p>{c('about.coFounders.copy.the-meeting-foundation.paragraph.in-8bc1d53c') + ' '}<span className="text-maroon-700 font-semibold">{c('about.coFounders.copy.the-meeting-foundation.text.1864-d9521266')}</span>{' ' + c('about.coFounders.copy.the-meeting-foundation.paragraph.came-the-momentous-meeting-76910a5d') + ' '}<span className="italic">{c('about.coFounders.copy.the-meeting-foundation.text.he-is-a-saint-i-can-feel-i-018dc8fc')}</span>{' '}{c('about.coFounders.copy.the-meeting-foundation.paragraph.she-said-to-all-don-bosco--accc9fab')}</p>
                      <p>{c('about.coFounders.copy.the-meeting-foundation.paragraph.in-8bc1d53c.2') + ' '}<span className="text-maroon-700 font-semibold">{c('about.coFounders.copy.the-meeting-foundation.text.1872-3f613c55')}</span>{' ' + c('about.coFounders.copy.the-meeting-foundation.paragraph.he-founded-the-society-of--7b21c532')}</p>
                      <p>
                        <span className="text-maroon-700 font-semibold">{c('about.coFounders.copy.the-meeting-foundation.text.1875-af9d0081')}</span>{' ' + c('about.coFounders.copy.the-meeting-foundation.paragraph.saw-the-first-expansion-of-d89bfbf6')}<span className="text-maroon-700 font-semibold">{' ' + c('about.coFounders.copy.the-meeting-foundation.text.1922-2c1f3f5f')}</span>.
                      </p>
                    </div>

                    {/* Timeline Visual */}
                    <div className="relative bg-gradient-to-b from-maroon-50 to-gold-50 rounded-2xl p-5 border border-gold-200">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-maroon-800 text-white flex items-center justify-center text-xs font-bold">{c('about.coFounders.copy.the-meeting-foundation.text.1-6b86b273')}</div>
                          <div>
                            <p className="text-xs font-semibold text-maroon-900">{c('about.coFounders.copy.the-meeting-foundation.paragraph.1864-d9521266')}</p>
                            <p className="text-[10px] text-gray-600">{c('about.coFounders.copy.the-meeting-foundation.paragraph.meeting-with-don-bosco-42a48526')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold-500 text-maroon-900 flex items-center justify-center text-xs font-bold">{c('about.coFounders.copy.the-meeting-foundation.text.2-d4735e3a')}</div>
                          <div>
                            <p className="text-xs font-semibold text-maroon-900">{c('about.coFounders.copy.the-meeting-foundation.paragraph.1872-3f613c55')}</p>
                            <p className="text-[10px] text-gray-600">{c('about.coFounders.copy.the-meeting-foundation.paragraph.founded-fma-c5caaee6')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-maroon-800 text-white flex items-center justify-center text-xs font-bold">{c('about.coFounders.copy.the-meeting-foundation.text.3-4e074085')}</div>
                          <div>
                            <p className="text-xs font-semibold text-maroon-900">{c('about.coFounders.copy.the-meeting-foundation.paragraph.1922-2c1f3f5f')}</p>
                            <p className="text-[10px] text-gray-600">{c('about.coFounders.copy.the-meeting-foundation.paragraph.arrived-in-india-f7d99d31')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ========================================================== */}
                {/* LEGACY SECTION */}
                {/* ========================================================== */}
                <motion.div 
                  variants={fadeInUp}
                  className="mt-8 pt-8 border-t border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                      <Heart size={18} />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-maroon-900">{c('about.coFounders.copy.her-enduring-legacy.heading.her-enduring-legacy-9a15c070')}</h3>
                  </div>

                  <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
                    <p>{c('about.coFounders.copy.her-enduring-legacy.paragraph.today-the-salesian-sisters-a1de0375')}</p>

                    {/* Legacy Quote Box */}
                    <div className="relative bg-gradient-to-r from-gold-50 to-amber-50 border-l-4 border-gold-500 p-5 rounded-r-xl">
                      <Quote size={20} className="text-gold-400 absolute -top-2 -left-2 bg-white rounded-full p-1" />
                      <div className="pl-6">
                        <p className="text-maroon-900 italic font-serif text-base md:text-lg leading-relaxed">{c('about.coFounders.copy.her-enduring-legacy.paragraph.i-entrust-them-to-you-a-di-4741713a')}</p>
                      </div>
                    </div>

                    {/* Legacy Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="text-center p-3 bg-maroon-50 rounded-xl">
                        <Globe size={20} className="mx-auto text-maroon-700" />
                        <p className="text-xs font-semibold text-maroon-900 mt-1">{c('about.coFounders.copy.her-enduring-legacy.paragraph.global-presence-783579ce')}</p>
                        <p className="text-[10px] text-gray-500">{c('about.coFounders.copy.her-enduring-legacy.paragraph.100-countries-f92d5fae')}</p>
                      </div>
                      <div className="text-center p-3 bg-maroon-50 rounded-xl">
                        <BookOpen size={20} className="mx-auto text-maroon-700" />
                        <p className="text-xs font-semibold text-maroon-900 mt-1">{c('about.coFounders.copy.her-enduring-legacy.paragraph.educational-institutions-79a1c8ce')}</p>
                        <p className="text-[10px] text-gray-500">{c('about.coFounders.copy.her-enduring-legacy.paragraph.2000-schools-4210cf19')}</p>
                      </div>
                      <div className="text-center p-3 bg-maroon-50 rounded-xl">
                        <Users size={20} className="mx-auto text-maroon-700" />
                        <p className="text-xs font-semibold text-maroon-900 mt-1">{c('about.coFounders.copy.her-enduring-legacy.paragraph.salesian-sisters-dc86dfd2')}</p>
                        <p className="text-[10px] text-gray-500">{c('about.coFounders.copy.her-enduring-legacy.paragraph.14-000-sisters-35261934')}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ========================================================== */}
                {/* BOTTOM CTA - Like a Prayer/Reflection */}
                {/* ========================================================== */}
                <motion.div 
                  variants={fadeInUp}
                  className="mt-8 pt-8 border-t border-gray-100"
                >
                  <div className="bg-gradient-to-br from-maroon-900 to-maroon-800 rounded-2xl p-6 md:p-8 text-center text-white">
                    <Sparkles size={24} className="text-gold-400 mx-auto mb-3" />
                    <h4 className="font-serif text-xl font-bold text-gold-300 mb-2">{c('about.coFounders.copy.may-her-legacy-inspire.heading.may-her-legacy-inspire-us-c993305a')}</h4>
                    <p className="text-maroon-200 text-sm max-w-md mx-auto">{c('about.coFounders.copy.may-her-legacy-inspire.paragraph.let-us-carry-forward-her-s-27231736')}</p>
                    <div className="mt-4 flex justify-center gap-2">
                      <span className="w-8 h-0.5 bg-gold-400/50 rounded-full" />
                      <span className="w-12 h-0.5 bg-gold-400 rounded-full" />
                      <span className="w-8 h-0.5 bg-gold-400/50 rounded-full" />
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* CSS Animations */}
      {/* ========================================================== */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .shadow-3xl {
          box-shadow: 0 30px 60px -15px rgba(122, 12, 30, 0.15);
        }

        .container-custom {
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (min-width: 640px) {
          .container-custom {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .container-custom {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CoFounders;