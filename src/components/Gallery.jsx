import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import WatermarkedImage from './WatermarkedImage'
import LoadingSpinner from './LoadingSpinner'
import { imageApi } from '../services/imageApi'

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [streetImages, setStreetImages] = useState([])
  const [natureImages, setNatureImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [preloadedUrls, setPreloadedUrls] = useState({})

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      // Use the new gallery endpoint to get only gallery images (03-07 for each category)
      const [street, nature] = await Promise.all([
        imageApi.getGalleryImages('street'),
        imageApi.getGalleryImages('nature')
      ])
      
      setStreetImages(street)
      setNatureImages(nature)
      
      // Preload secure URLs for all images
      await preloadImageUrls([...street, ...nature])
      
      setError(null)
    } catch (err) {
      console.error('Error loading images:', err)
      setError('Failed to load images. Please ensure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  const preloadImageUrls = async (images) => {
    const urlMap = {}
    await Promise.all(
      images.map(async (img) => {
        try {
          const url = await imageApi.getSecureImageUrl(img._id, false)
          urlMap[img._id] = url
        } catch (error) {
          console.error(`Error preloading URL for image ${img._id}:`, error)
        }
      })
    )
    setPreloadedUrls(urlMap)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoadingSpinner message="Loading gallery..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button 
            onClick={loadImages}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-white">Gallery</h1>
          <p className="text-lg text-base-content/70">Explore my photography collection</p>
        </motion.div>

        {/* Content Sections */}
        <div>
          {/* Street Photography Carousel */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-center text-white">Street Photography</h2>
            </div>
            {streetImages.length > 0 && (
              <Carousel images={streetImages} onImageClick={setSelectedImage} preloadedUrls={preloadedUrls} />
            )}
            
            {/* Street Category Button */}
            <div className="text-center mt-6">
              <Link to="/all-images?filter=Street">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 group text-sm font-medium cursor-pointer"
                >
                  View All Street
                  <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Nature Photography Carousel */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-center text-white">Nature Photography</h2>
            </div>
            {natureImages.length > 0 && (
              <Carousel images={natureImages} onImageClick={setSelectedImage} preloadedUrls={preloadedUrls} />
            )}
            
            {/* Nature Category Button */}
            <div className="text-center mt-6">
              <Link to="/all-images?filter=Nature">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 group text-sm font-medium cursor-pointer"
                >
                  View All Nature
                  <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </Link>
            </div>
          </div>

          {/* View All Images Button - Centered at the end */}
          <div className="text-center mt-12">
            <Link to="/all-images">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 group text-lg font-medium cursor-pointer"
              >
                View All Images
                <svg className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

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
                imageId={selectedImage._id}
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
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Carousel Component (Continued in Part 2)
function Carousel({ images, onImageClick, preloadedUrls }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const slideVariants = {
    enter: (direction) => ({
      x: !isMobile ? (direction > 0 ? 1000 : -1000) : 0,
      y: isMobile ? (direction > 0 ? 1000 : -1000) : 0,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: !isMobile ? (direction < 0 ? 1000 : -1000) : 0,
      y: isMobile ? (direction < 0 ? 1000 : -1000) : 0,
      opacity: 0,
      scale: 0.8
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return (prevIndex + 1) % images.length
      } else {
        return (prevIndex - 1 + images.length) % images.length
      }
    })
  }

  const getPrevIndex = () => (currentIndex - 1 + images.length) % images.length
  const getNextIndex = () => (currentIndex + 1) % images.length

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className={`relative ${isMobile ? 'h-[600px] px-6' : 'h-[400px]'} flex items-center justify-center overflow-hidden ${isMobile ? 'flex-col' : ''}`}>
        {/* Previous Image (15% visible on left/top) */}
        <div className={`absolute ${isMobile ? 'top-0 w-full h-1/4 px-12' : 'left-0 w-1/4 h-3/4'} z-0 opacity-50 group`}>
          <div className="relative overflow-hidden rounded-lg w-full h-full">
            <WatermarkedImage
              imageId={images[getPrevIndex()]._id}
              alt={images[getPrevIndex()].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              preloadedUrl={preloadedUrls[images[getPrevIndex()]._id]}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* Main Image (Center) */}
        <div className={`relative ${isMobile ? 'w-full h-3/5 px-4' : 'w-3/5 h-full'} flex items-center justify-center z-10`}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              drag={isMobile ? "y" : "x"}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = isMobile 
                  ? swipePower(offset.y, velocity.y)
                  : swipePower(offset.x, velocity.x)

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1)
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1)
                }
              }}
              className="absolute w-full h-full cursor-grab active:cursor-grabbing"
            >
              <div className="relative group overflow-hidden rounded-lg shadow-2xl w-full h-full cursor-pointer"
                   onClick={() => onImageClick(images[currentIndex])}>
                {/* Loading skeleton */}
                {isImageLoading && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-10">
                    <div className="text-center">
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
                        className="w-16 h-16 mx-auto mb-4 relative"
                      >
                        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" className="text-primary" opacity="0.8"/>
                          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" opacity="0.6"/>
                        </svg>
                      </motion.div>
                      <motion.p
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-gray-400 text-sm"
                      >
                        Loading image...
                      </motion.p>
                    </div>
                  </div>
                )}
                <WatermarkedImage
                  imageId={images[currentIndex]._id}
                  alt={images[currentIndex].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  preloadedUrl={preloadedUrls[images[currentIndex]._id]}
                  onLoadingChange={setIsImageLoading}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h4 className="text-xl font-semibold mb-1">{images[currentIndex].title}</h4>
                  <p className="text-sm text-gray-300">{images[currentIndex].location} • {images[currentIndex].year}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Image (15% visible on right/bottom) */}
        <div className={`absolute ${isMobile ? 'bottom-0 w-full h-1/4 px-12' : 'right-0 w-1/4 h-3/4'} z-0 opacity-50 group`}>
          <div className="relative overflow-hidden rounded-lg w-full h-full">
            <WatermarkedImage
              imageId={images[getNextIndex()]._id}
              alt={images[getNextIndex()].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              preloadedUrl={preloadedUrls[images[getNextIndex()]._id]}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => paginate(-1)}
          className={`absolute ${isMobile ? 'top-8 left-1/2 -translate-x-1/2' : 'left-4'} z-20 btn btn-circle btn-ghost bg-base-100/50 hover:bg-base-100/80 cursor-pointer`}
          aria-label="Previous image"
        >
          <ChevronLeftIcon className={`w-6 h-6 ${isMobile ? 'rotate-90' : ''}`} />
        </button>

        <button
          onClick={() => paginate(1)}
          className={`absolute ${isMobile ? 'bottom-8 left-1/2 -translate-x-1/2' : 'right-4'} z-20 btn btn-circle btn-ghost bg-base-100/50 hover:bg-base-100/80 cursor-pointer`}
          aria-label="Next image"
        >
          <ChevronRightIcon className={`w-6 h-6 ${isMobile ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Radio Buttons Indicator */}
      <div className="flex justify-center gap-3 mt-6">
        {images.map((_, index) => (
          <label
            key={index}
            className="cursor-pointer"
            aria-label={`Go to image ${index + 1}`}
          >
            <input
              type="radio"
              name={`carousel-${images[0]._id}`}
              className="radio radio-primary radio-sm"
              checked={index === currentIndex}
              onChange={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
            />
          </label>
        ))}
      </div>

      {/* Image Details */}
      <div className="text-center mt-4">
        <h3 className="text-2xl font-bold mb-2">{images[currentIndex].title}</h3>
        <p className="text-base-content/70">
          <span className="inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {images[currentIndex].location}
          </span>
          <span className="mx-3">•</span>
          <span className="inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {images[currentIndex].year}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Gallery

