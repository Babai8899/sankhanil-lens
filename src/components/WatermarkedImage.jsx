import React, { useRef, useEffect, useState } from 'react'

const WatermarkedImage = ({ src, alt, className, ...props }) => {
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const originalSrc = useRef(src)

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
    const fontSize = Math.max(canvas.width / 15, 32) // Larger, more visible watermark
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

  const handleRightClick = (e) => {
    e.preventDefault()
    
    // Create watermarked version when right-clicked
    if (imgRef.current && isImageLoaded) {
      const originalImg = new Image()
      originalImg.crossOrigin = 'anonymous'
      
      originalImg.onload = () => {
        const watermarkedDataUrl = createWatermarkedImage(originalImg)
        if (watermarkedDataUrl) {
          // Replace image source temporarily
          const originalSrc = imgRef.current.src
          imgRef.current.src = watermarkedDataUrl
          
          // Show context menu with watermarked image
          setTimeout(() => {
            if (imgRef.current) {
              imgRef.current.src = originalSrc
            }
          }, 3000) // Keep watermarked version for 3 seconds
        }
      }
      
      originalImg.src = originalSrc.current
    }
    
    return false
  }

  const handleDragStart = (e) => {
    e.preventDefault()
    return false
  }

  const handleKeyDown = (e) => {
    // Prevent common save shortcuts
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault()
      return false
    }
  }

  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  useEffect(() => {
    originalSrc.current = src
    
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [src])

  return (
    <div className="relative image-container">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`protected-image ${className}`}
        onContextMenu={handleRightClick}
        onDragStart={handleDragStart}
        onLoad={handleImageLoad}
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

