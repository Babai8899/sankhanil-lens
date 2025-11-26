
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'react-router-dom'
import WatermarkedImage from './WatermarkedImage'
import LoadingSpinner from './LoadingSpinner'
import { imageApi } from '../services/imageApi'

function AllImages() {
  const [searchParams] = useSearchParams()
  const filterParam = searchParams.get('filter') || 'All'
  
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeFilter, setActiveFilter] = useState(filterParam)
  const [gridColumns, setGridColumns] = useState(4) // Default 4 columns
  const [allImages, setAllImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load images from API
  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      const images = await imageApi.getAllImages()
      setAllImages(images)
      setError(null)
    } catch (err) {
      console.error('Error loading images:', err)
      setError('Failed to load images. Please ensure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  // Update filter when URL parameter changes
  useEffect(() => {
    if (filterParam && ['All', 'Street', 'Nature'].includes(filterParam)) {
      setActiveFilter(filterParam)
    }
  }, [filterParam])

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Handle zoom with mouse wheel
  useEffect(() => {
    let lastZoomTime = 0
    const ZOOM_THROTTLE = 300 // Milliseconds between zoom steps
    
    const handleWheel = (e) => {
      // Only trigger on Ctrl+scroll (pinch-to-zoom gesture)
      if (e.ctrlKey) {
        e.preventDefault()
        
        const now = Date.now()
        if (now - lastZoomTime < ZOOM_THROTTLE) {
          return // Throttle zoom to make it slower
        }
        lastZoomTime = now
        
        setGridColumns(prev => {
          if (e.deltaY < 0) {
            // Zooming in - fewer columns (min 3)
            return Math.max(3, prev - 1)
          } else {
            // Zooming out - more columns (max 6)
            return Math.min(6, prev + 1)
          }
        })
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Get responsive grid classes based on current zoom level
  const getGridClasses = () => {
    const baseClasses = "grid gap-6"
    
    switch (gridColumns) {
      case 3:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3`
      case 4:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
      case 5:
        return `${baseClasses} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`
      case 6:
        return `${baseClasses} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
    }
  }

  // Filter images based on active filter
  const filteredImages = activeFilter === 'All' 
    ? allImages 
    : allImages.filter(img => img.category.toLowerCase() === activeFilter.toLowerCase())

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoadingSpinner message="Loading images..." />
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-base-200 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-white">All Photography</h1>
          <p className="text-lg text-base-content/70">
            {activeFilter === 'All' 
              ? `Complete collection of ${allImages.length} photographs`
              : `${filteredImages.length} ${activeFilter} photographs`
            }
          </p>
          <p className="text-sm text-base-content/50 mt-2">
            Use Ctrl + Mouse Wheel to zoom in/out • Grid: {gridColumns} columns (3-6 range)
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-8 mb-12 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('All')}
            className={`px-8 py-3 text-lg font-medium transition-all duration-300 relative border-b-2 cursor-pointer ${
              activeFilter === 'All' 
                ? 'text-primary border-primary bg-primary/10' 
                : 'text-base-content/70 border-transparent hover:text-primary hover:border-primary/50'
            }`}
          >
            All ({allImages.length})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('Street')}
            className={`px-8 py-3 text-lg font-medium transition-all duration-300 relative border-b-2 cursor-pointer ${
              activeFilter === 'Street' 
                ? 'text-primary border-primary bg-primary/10' 
                : 'text-base-content/70 border-transparent hover:text-primary hover:border-primary/50'
            }`}
          >
            Street ({allImages.filter(img => img.category.toLowerCase() === 'street').length})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('Nature')}
            className={`px-8 py-3 text-lg font-medium transition-all duration-300 relative border-b-2 cursor-pointer ${
              activeFilter === 'Nature' 
                ? 'text-primary border-primary bg-primary/10' 
                : 'text-base-content/70 border-transparent hover:text-primary hover:border-primary/50'
            }`}
          >
            Nature ({allImages.filter(img => img.category.toLowerCase() === 'nature').length})
          </motion.button>
        </div>

        {/* Image Grid */}
        <motion.div
          key={`${activeFilter}-${gridColumns}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={getGridClasses()}
        >
          {filteredImages.map((image) => (
            <motion.div
              key={image._id}
              variants={itemVariants}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg aspect-square">
                <WatermarkedImage
                  imageId={image._id}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="font-semibold text-sm mb-1 truncate">{image.title}</h3>
                  <p className="text-xs text-gray-300 truncate">
                    {image.location} • {image.year}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/80 rounded">
                    {image.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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

export default AllImages

