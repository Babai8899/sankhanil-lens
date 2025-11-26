import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ message = "Loading...", size = "large" }) => {
  const iconSize = size === "large" ? "w-16 h-16" : size === "medium" ? "w-12 h-12" : "w-8 h-8"
  const textSize = size === "large" ? "text-sm" : "text-xs"

  return (
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
        className={`${iconSize} mx-auto mb-4 relative`}
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
        className={`text-gray-400 ${textSize}`}
      >
        {message}
      </motion.p>
    </div>
  )
}

export default LoadingSpinner
