import { useEffect } from 'react'

const ScreenshotProtection = () => {
  useEffect(() => {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768
    
    // Disable protection on mobile devices
    if (isMobile) {
      return
    }

    let blackoutOverlay = null
    let isBlackoutActive = false
    let permanentBlackout = false

    const createBlackoutOverlay = () => {
      if (!blackoutOverlay) {
        blackoutOverlay = document.createElement('div')
        blackoutOverlay.id = 'screenshot-protection-overlay'
        blackoutOverlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%);
          z-index: 2147483647;
          pointer-events: none;
          display: none;
          opacity: 1;
        `
        
        // Create message container
        const messageContainer = document.createElement('div')
        messageContainer.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 40px;
        `
        
        // Create icon
        const icon = document.createElement('div')
        icon.innerHTML = `
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 20px; color: #ef4444;">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        `
        messageContainer.appendChild(icon)
        
        // Create title
        const title = document.createElement('h2')
        title.textContent = 'Screenshot Blocked'
        title.style.cssText = `
          font-size: 32px;
          font-weight: bold;
          margin: 0 0 16px 0;
          color: #ef4444;
        `
        messageContainer.appendChild(title)
        
        // Create message
        const message = document.createElement('p')
        message.textContent = 'This content is protected. Screenshots are not allowed.'
        message.style.cssText = `
          font-size: 18px;
          margin: 0 0 12px 0;
          color: #e5e7eb;
          line-height: 1.6;
        `
        messageContainer.appendChild(message)
        
        // Create sub message
        const subMessage = document.createElement('p')
        subMessage.textContent = 'Please respect the photographer\'s intellectual property.'
        subMessage.style.cssText = `
          font-size: 14px;
          margin: 0;
          color: #9ca3af;
          line-height: 1.6;
        `
        messageContainer.appendChild(subMessage)
        
        blackoutOverlay.appendChild(messageContainer)
        document.body.appendChild(blackoutOverlay)
      }
      return blackoutOverlay
    }

    const showBlackout = (duration = 3000) => {
      const overlay = createBlackoutOverlay()
      overlay.style.display = 'block'
      isBlackoutActive = true
      
      if (!permanentBlackout && duration > 0) {
        setTimeout(() => {
          if (isBlackoutActive && !permanentBlackout) {
            overlay.style.display = 'none'
            isBlackoutActive = false
          }
        }, duration)
      }
    }

    const showPermanentBlackout = () => {
      permanentBlackout = true
      const overlay = createBlackoutOverlay()
      overlay.style.display = 'block'
      isBlackoutActive = true
      
      // Keep black for 5 seconds before allowing back
      setTimeout(() => {
        permanentBlackout = false
        if (!document.hasFocus()) {
          // Still not focused, keep it black
          showPermanentBlackout()
        } else {
          overlay.style.display = 'none'
          isBlackoutActive = false
        }
      }, 5000)
    }

    const hideBlackout = () => {
      if (blackoutOverlay && !permanentBlackout) {
        blackoutOverlay.style.display = 'none'
        isBlackoutActive = false
      }
    }

    // Detect PrintScreen and keyboard shortcuts
    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault()
        showBlackout(3000)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault()
        showBlackout(3000)
        return false
      }
      
      if (e.key === 's' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        showBlackout(3000)
        return false
      }
      
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault()
        showBlackout(3000)
        return false
      }
      
      if (e.altKey && (e.key === 'PrintScreen' || e.keyCode === 44)) {
        e.preventDefault()
        showBlackout(3000)
        return false
      }

      if (e.ctrlKey && (e.key === 'PrintScreen' || e.keyCode === 44)) {
        e.preventDefault()
        showBlackout(3000)
        return false
      }
    }

    // CRITICAL: Detect when window loses focus - this catches Snipping Tool
    const handleBlur = () => {
      showPermanentBlackout()
    }

    // Detect visibility change - CRITICAL for mobile
    const handleVisibilityChange = () => {
      if (document.hidden) {
        showPermanentBlackout()
      }
    }

    // Mobile-specific: Detect page freeze (screenshot on some devices)
    const handlePageShow = (e) => {
      if (e.persisted) {
        // Page was restored from cache, might be after screenshot
        showBlackout(3000)
      }
    }

    // Mobile: Detect orientation change (some screenshot tools trigger this)
    const handleOrientationChange = () => {
      showBlackout(2000)
    }

    // Mobile: Detect touch cancellation (can happen during screenshot gesture)
    const handleTouchCancel = () => {
      showBlackout(1000)
    }

    // Detect focus return
    let lastFocusTime = Date.now()
    const handleFocus = () => {
      const now = Date.now()
      if (now - lastFocusTime < 2000) {
        showBlackout(3000)
      }
      lastFocusTime = now
      
      // Clear permanent blackout when focus returns
      if (permanentBlackout && document.hasFocus()) {
        permanentBlackout = false
        hideBlackout()
      }
    }

    const handleBeforePrint = () => {
      showBlackout(5000)
    }

    // Track user activity
    let lastActivity = Date.now()
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click']
    
    const updateActivity = () => {
      lastActivity = Date.now()
      if (isBlackoutActive && !permanentBlackout && document.hasFocus()) {
        hideBlackout()
      }
    }

    const handleResize = () => {
      showBlackout(2000)
    }

    // CRITICAL: Continuous aggressive monitoring
    const aggressiveMonitor = setInterval(() => {
      // If window is not focused, show black immediately
      if (!document.hasFocus()) {
        if (!isBlackoutActive) {
          showPermanentBlackout()
        }
      } else if (permanentBlackout) {
        // Reset permanent blackout when window regains focus
        permanentBlackout = false
        hideBlackout()
      }
    }, 50) // Check every 50ms for instant response

    // Create overlay immediately
    createBlackoutOverlay()

    // Add all event listeners with capture phase
    document.addEventListener('keyup', handleKeyUp, true)
    document.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('blur', handleBlur, true)
    window.addEventListener('focus', handleFocus, true)
    document.addEventListener('visibilitychange', handleVisibilityChange, true)
    window.addEventListener('beforeprint', handleBeforePrint, true)
    window.addEventListener('resize', handleResize, true)
    window.addEventListener('pageshow', handlePageShow, true)
    window.addEventListener('orientationchange', handleOrientationChange, true)
    document.addEventListener('touchcancel', handleTouchCancel, true)
    
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    // Cleanup
    return () => {
      document.removeEventListener('keyup', handleKeyUp, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('blur', handleBlur, true)
      window.removeEventListener('focus', handleFocus, true)
      document.removeEventListener('visibilitychange', handleVisibilityChange, true)
      window.removeEventListener('beforeprint', handleBeforePrint, true)
      window.removeEventListener('resize', handleResize, true)
      window.removeEventListener('pageshow', handlePageShow, true)
      window.removeEventListener('orientationchange', handleOrientationChange, true)
      document.removeEventListener('touchcancel', handleTouchCancel, true)
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity, true)
      })
      
      clearInterval(aggressiveMonitor)
      
      if (blackoutOverlay && blackoutOverlay.parentNode) {
        blackoutOverlay.parentNode.removeChild(blackoutOverlay)
      }
    }
  }, [])

  return null
}

export default ScreenshotProtection
