import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { imageApi } from '../services/imageApi'

const WatermarkedImage = ({ imageId, alt, className, preloadedUrl, onLoadingChange, ...props }) => {
  const imgRef = useRef(null)
  const canvasRef = useRef(null)
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

  const createWatermarkedImage = (originalImg) => {
    const canvas = canvasRef.current
    if (!canvas || !originalImg) return null

    const ctx = canvas.getContext('2d')
    
    // Set canvas dimensions to match image
    canvas.width = originalImg.naturalWidth
    canvas.height = originalImg.naturalHeight

    // Draw the original image
    ctx.drawImage(originalImg, 0, 0)

    // Configure watermark text
    const watermarkText = 'SANKHANIL'
    const fontSize = Math.max(canvas.width / 100, 8) // Larger, more visible watermark
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)' // More visible watermark
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.lineWidth = 2
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Get text dimensions
    const textMetrics = ctx.measureText(watermarkText)
    const textWidth = textMetrics.width
    const textHeight = fontSize

    // Calculate spacing for repeated watermarks
    const spacingX = textWidth + 40
    const spacingY = textHeight + 40

    // Create repeated watermarks across the image
    for (let x = -canvas.width; x < canvas.width * 2; x += spacingX) {
      for (let y = -canvas.height; y < canvas.height * 2; y += spacingY) {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(-Math.PI / 6) // -30 degrees
        
        // Draw stroke first (outline)
        ctx.strokeText(watermarkText, 0, 0)
        // Then fill text
        ctx.fillText(watermarkText, 0, 0)
        
        ctx.restore()
      }
    }

    // Convert canvas to data URL (base64)
    return canvas.toDataURL('image/jpeg', 0.9)
  }

  const applyWatermarkTemporarily = () => {
    if (imgRef.current && imageLoaded) {
      const originalImg = new Image()
      originalImg.crossOrigin = 'anonymous'
      
      originalImg.onload = () => {
        const watermarkedDataUrl = createWatermarkedImage(originalImg)
        if (watermarkedDataUrl) {
          // Replace image source temporarily
          const currentSrc = imgRef.current.src
          imgRef.current.src = watermarkedDataUrl
          
          // Restore original after 3 seconds
          setTimeout(() => {
            if (imgRef.current) {
              imgRef.current.src = currentSrc
            }
          }, 3000)
        }
      }
      
      originalImg.src = imageSrc
    }
  }

  const handleRightClick = (e) => {
    e.preventDefault()
    applyWatermarkTemporarily()
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
      }
    }

    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [imageId, imageSrc, imageLoaded])

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
        onSelectStart={() => false}
        onMouseDown={(e) => {
          if (e.button === 2) { // Right click
            handleRightClick(e)
          }
        }}
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
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
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