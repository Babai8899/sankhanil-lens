
import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function About() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-900">
      {/* About Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Single About Section */}
          <AboutSection />
        </div>
      </section>
    </div>
  )
}

// About Section Component with single layout
function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const [imageLoaded, setImageLoaded] = useState(false)

  const imageVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 }
  }

  const textVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <div ref={ref} className="flex flex-col lg:flex-row items-start gap-12">
      {/* Profile Image Section - Left side, vertical */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="lg:w-2/5 w-full"
      >
        <div className="relative group overflow-hidden rounded-lg shadow-2xl w-full aspect-[3/4]">
          {/* Loading state */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16"
              >
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" className="text-primary" opacity="0.8"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" opacity="0.6"/>
                </svg>
              </motion.div>
            </div>
          )}
          <img 
            src="/profile.jpg" 
            alt="Sankhanil - Photographer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error('Image failed to load:', e);
              setImageLoaded(true); // Hide loading animation even on error
            }}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <h4 className="text-lg font-semibold">Sankhanil</h4>
            <p className="text-sm text-gray-300">Professional Photographer</p>
          </div>
        </div>
      </motion.div>

      {/* Combined Text Content Section - Right side */}
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="lg:w-2/3 w-full space-y-8 text-left"
      >
        {/* Who Am I Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-0.5 bg-blue-400"></div>
            <span className="text-blue-400 text-sm font-medium uppercase tracking-wider">About</span>
          </div>
          <h2 className="text-3xl font-bold text-white text-left">Who Am I?</h2>
          <p className="text-gray-300 text-lg leading-relaxed text-left">
            I am Sankhanil, a passionate photographer specializing in nature and street photography. My journey began over a decade ago during a college trip to the mountains. What started as a hobby quickly transformed into my profession. I find beauty in both serene landscapes and bustling urban life, capturing moments that tell stories and freeze emotions in time.
          </p>
        </div>

        {/* My Background Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white text-left">My Background</h3>
          <p className="text-gray-300 text-lg leading-relaxed text-left">
            With over 10 years of experience, I have traveled across India documenting diverse cultures and landscapes. My work has been featured in exhibitions and magazines. I hold a diploma from Delhi Institute of Photography and conduct workshops for aspiring photographers. My philosophy is simple: every moment has the potential to become a masterpiece if you know how to see it.
          </p>
        </div>
        
        {/* Statistics and Call to Action Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">10+</div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">500+</div>
              <div className="text-sm text-gray-400">Projects Completed</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">50+</div>
              <div className="text-sm text-gray-400">Awards Won</div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 group"
          >
            View My Work
            <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default About

