import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { imageApi } from '../services/imageApi'

const WatermarkedImage = ({ imageId, alt, className, preloadedUrl, onLoadingChange, ...props }) => {
  const imgRef = useRef(null)
  const [imageSrc, setImageSrc] = useState(preloadedUrl || '')
  const [loading, setLoading] = useState(!preloadedUrl)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (preloadedUrl) {
      setImageSrc(preloadedUrl)
      setLoading(false)
      setImageLoaded(false) // Reset on new preloadedUrl
    } else if (imageId) {
      loadSecureImage()
    }
  }, [imageId, preloadedUrl])

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading || !imageLoaded)
    }
  }, [loading, imageLoaded, onLoadingChange])

  const loadSecureImage = async () => {
    try {
      setLoading(true)
      // Get secure URL with token
      const secureUrl = await imageApi.getSecureImageUrl(imageId, false)
      setImageSrc(secureUrl)
    } catch (error) {
      console.error('Error loading secure image:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyWatermarkTemporarily = async () => {
    if (imgRef.current) {
      try {
        const watermarkedUrl = await imageApi.getSecureImageUrl(imageId, true)
        imgRef.current.src = watermarkedUrl
        
        // Reset after 2 seconds
        setTimeout(() => {
          loadSecureImage()
        }, 2000)
      } catch (error) {
        console.error('Error applying watermark:', error)
      }
    }
  }

  const handleRightClick = (e) => {
    e.preventDefault()
    applyWatermarkTemporarily()
    alert('Image download is protected. Watermark applied.')
    return false
  }

  const handleDragStart = (e) => {
    e.preventDefault()
    applyWatermarkTemporarily()
    return false
  }

  const handleKeyDown = (e) => {
    // Prevent common save shortcuts and apply watermark
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault()
      applyWatermarkTemporarily()
      alert('Image download is protected. Watermark applied.')
      return false
    }
  }

  const handleLoad = () => {
    // Additional protection after image loads
    if (imgRef.current) {
      imgRef.current.style.userSelect = 'none'
    }
    setImageLoaded(true)
  }

  useEffect(() => {
    // Prevent print screen and apply watermark
    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen') {
        applyWatermarkTemporarily()
        alert('Screenshots detected. Watermark applied for protection.')
      }
    }

    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [imageId, imageSrc])

  if (loading || !imageSrc) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center`}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-8 h-8"
        >
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" className="text-primary" opacity="0.8"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" opacity="0.6"/>
          </svg>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative image-container w-full h-full">
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`protected-image ${className}`}
        onContextMenu={handleRightClick}
        onDragStart={handleDragStart}
        onLoad={handleLoad}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitUserDrag: 'none',
          WebkitTouchCallout: 'none'
        }}
        {...props}
      />
      
      {/* Invisible overlay to prevent certain actions */}
      <div 
        className="absolute inset-0 pointer-events-none select-none"
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      />
    </div>
  )
}

export default WatermarkedImage

