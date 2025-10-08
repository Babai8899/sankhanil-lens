
import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import WatermarkedImage from './WatermarkedImage'

function Home() {
  const [selectedImage, setSelectedImage] = useState(null)
  // Sample featured photos data - using local images from public folder
  const featuredPhotos = [
    {
      id: 1,
      title: "Morning Dew",
      description: "Captured during the golden hour, this image showcases the delicate beauty of morning dew on wildflowers in the countryside.",
      category: "Nature",
      location: "Countryside Valley",
      image: "/src/assets/1000070291.jpg",
      year: "2024"
    },
    {
      id: 2,
      title: "Urban Reflections",
      description: "Street photography capturing the essence of city life through reflections in rain-soaked pavements during a busy evening.",
      category: "Street",
      location: "Downtown District",
      image: "/src/assets/1000070292.jpg",
      year: "2024"
    },
    {
      id: 3,
      title: "Autumn Serenity",
      description: "A peaceful forest scene during autumn, where golden leaves create a natural carpet under the soft afternoon light.",
      category: "Nature",
      location: "Forest Trail",
      image: "/src/assets/1000070293.jpg",
      year: "2024"
    },
    {
      id: 4,
      title: "City Lights",
      description: "The vibrant energy of the city captured through long exposure photography, showing the flow of traffic and life.",
      category: "Street",
      location: "Main Avenue",
      image: "/src/assets/1000070291.jpg", // Reusing first image for the 4th photo
      year: "2024"
    }
  ]

  const scrollToFeatured = () => {
    const featuredSection = document.getElementById('featured-section')
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection onExploreClick={scrollToFeatured} />
      
      {/* Featured Photos Section */}
      <section id="featured-section" className="py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Featured Works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A curated selection of photographs capturing moments in nature and urban life
            </p>
          </motion.div>

          {/* Photo Grid */}
          <div className="space-y-24 w-full">
            {featuredPhotos.map((photo, index) => (
              <FeaturedPhotoCard 
                key={photo.id} 
                photo={photo} 
                isReversed={index % 2 === 1} 
                onImageClick={setSelectedImage}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 btn btn-circle btn-ghost text-white cursor-pointer"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <WatermarkedImage
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <div className="mt-4 text-white text-center">
                <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
                <p className="text-base-content/70">
                  <span className="inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {selectedImage.location}
                  </span>
                  <span className="mx-3">•</span>
                  <span className="inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 715.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {selectedImage.year}
                  </span>
                  <span className="mx-3">•</span>
                  <span className="badge badge-primary">{selectedImage.category}</span>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Hero Section Component
function HeroSection({ onExploreClick }) {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          Sankhanil Lens
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-8"
        >
          Capturing moments in nature and street photography
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="space-x-4"
        >
          <button 
            onClick={onExploreClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            View Featured Works
          </button>
          <Link 
            to="/gallery"
            className="inline-block border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Full Gallery
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={onExploreClick}
      >
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}

// Featured Photo Card Component with alternating layout
function FeaturedPhotoCard({ photo, isReversed, onImageClick }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const imageVariants = {
    hidden: { opacity: 0, x: isReversed ? 100 : -100 },
    visible: { opacity: 1, x: 0 }
  }

  const textVariants = {
    hidden: { opacity: 0, x: isReversed ? -100 : 100 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <div ref={ref} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 w-full max-w-full`}>
      {/* Image Section */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="lg:w-1/2 w-full"
      >
        <div className="relative group overflow-hidden rounded-lg shadow-2xl w-full cursor-pointer"
             onClick={() => onImageClick(photo)}>
          <WatermarkedImage 
            src={photo.image} 
            alt={photo.title}
            className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <h4 className="text-lg font-semibold">{photo.title}</h4>
            <p className="text-sm text-gray-300">{photo.category} • {photo.year}</p>
          </div>
        </div>
      </motion.div>

      {/* Details Section */}
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="lg:w-1/2 w-full space-y-6"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-4 text-sm text-blue-400">
            <span className="bg-blue-900/30 px-3 py-1 rounded-full border border-blue-800">{photo.category}</span>
            <span className="text-gray-400">{photo.year}</span>
          </div>
          <h3 className="text-3xl font-bold text-white">{photo.title}</h3>
          <p className="text-gray-400 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {photo.location}
          </p>
        </div>
        
        <p className="text-gray-300 text-lg leading-relaxed">
          {photo.description}
        </p>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onImageClick(photo)}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 group cursor-pointer"
        >
          View Image
          <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Home
