
import React from 'react'
import { motion } from 'framer-motion'

function Events() {
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 transition-colors duration-300 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <svg className="w-32 h-32 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Coming Soon Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-base-content/70 mb-8">
            Exciting photography events and exhibitions are on the way
          </p>
          
          {/* Stay Connected Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-block bg-base-100 rounded-lg px-8 py-6 shadow-xl"
          >
            <p className="text-lg text-base-content mb-2">
              📸 Stay Connected
            </p>
            <p className="text-base-content/60">
              Follow us for updates on upcoming exhibitions and photography events
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
        </motion.div>
      </div>
    </div>
  )
}

export default Events
