
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import WatermarkedImage from './WatermarkedImage'

function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Sample events data using local images
  const events = [
    {
      id: 1,
      title: "Street Stories: An Urban Photography Exhibition",
      description: "A captivating collection of street photography showcasing the raw beauty and authentic moments of city life. From bustling intersections to quiet alleyways, this exhibition captures the essence of urban living through the lens.",
      date: "March 15 - April 30, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "Downtown Art Gallery, Main Street",
      status: "Past Event",
      image: "/src/assets/1000070291.jpg",
      images: ["/src/assets/1000070291.jpg", "/src/assets/1000070292.jpg", "/src/assets/1000070293.jpg"],
      highlights: [
        "25 carefully curated street photographs",
        "Interactive storytelling sessions",
        "Meet & greet with the photographer",
        "Limited edition prints available"
      ]
    },
    {
      id: 2,
      title: "Nature's Canvas: Landscape Photography Showcase",
      description: "Immerse yourself in the breathtaking beauty of nature through this stunning landscape photography exhibition. Experience the serene majesty of mountains, forests, and countryside through masterful compositions.",
      date: "June 10 - July 25, 2024",
      time: "9:00 AM - 7:00 PM",
      location: "City Museum of Arts, Heritage District",
      status: "Past Event",
      image: "/src/assets/1000070292.jpg",
      images: ["/src/assets/1000070292.jpg", "/src/assets/1000070293.jpg", "/src/assets/1000070291.jpg"],
      highlights: [
        "30 large-format nature photographs",
        "Behind-the-scenes photography workshop",
        "Guided tours every weekend",
        "Photography technique demonstrations"
      ]
    },
    {
      id: 3,
      title: "Moments in Time: A Retrospective Exhibition",
      description: "A comprehensive retrospective showcasing the evolution of Sankhanil's photography journey. From early experimental works to recent masterpieces, explore the artistic growth and diverse perspectives captured over the years.",
      date: "September 5 - October 20, 2024",
      time: "11:00 AM - 8:00 PM",
      location: "Contemporary Arts Center, Cultural Quarter",
      status: "Past Event",
      image: "/src/assets/1000070293.jpg",
      images: ["/src/assets/1000070293.jpg", "/src/assets/1000070291.jpg", "/src/assets/1000070292.jpg"],
      highlights: [
        "50+ photographs spanning 5 years",
        "Artist talk and Q&A session",
        "Photography masterclass workshops",
        "Exclusive exhibition catalog"
      ]
    },
    {
      id: 4,
      title: "Future Visions: Upcoming Photography Exhibition",
      description: "An exciting new exhibition featuring the latest works exploring themes of technology, humanity, and the evolving urban landscape. Discover fresh perspectives on contemporary life through innovative photographic techniques.",
      date: "December 12, 2024 - February 14, 2025",
      time: "10:00 AM - 6:00 PM",
      location: "Modern Gallery Space, Innovation District",
      status: "Upcoming",
      image: "/1000070291.jpg",
      images: ["/1000070291.jpg", "/1000070292.jpg", "/1000070293.jpg"],
      highlights: [
        "Brand new collection of 40 photographs",
        "Virtual reality photo experience",
        "Opening night reception",
        "Digital photography workshop series"
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-white">Events & Exhibitions</h1>
          <p className="text-lg text-gray-600 dark:text-base-content/70">
            Discover photography exhibitions and events showcasing artistic vision
          </p>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:gap-12"
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={cardVariants}
              className="bg-base-100 rounded-lg shadow-xl overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Event Image */}
                <div className="lg:w-2/5 relative group">
                  <div 
                    className="relative overflow-hidden cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <WatermarkedImage
                      src={event.image}
                      alt={event.title}
                      className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === 'Upcoming' 
                        ? 'bg-primary text-white' 
                        : 'bg-base-content/20 text-white'
                    }`}>
                      {event.status}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="lg:w-3/5 p-6 lg:p-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl lg:text-3xl font-bold text-base-content">
                      {event.title}
                    </h2>

                    {/* Event Meta */}
                    <div className="space-y-2 text-base-content/70">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-base-content/80 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Highlights */}
                    <div>
                      <h4 className="font-semibold text-base-content mb-2">Event Highlights:</h4>
                      <ul className="space-y-1 text-base-content/70">
                        {event.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-2">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* View Details Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEvent(event)}
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 group mt-4 cursor-pointer"
                    >
                      View Event Gallery
                      <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Event Gallery Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <button
            onClick={() => setSelectedEvent(null)}
            className="absolute top-4 right-4 btn btn-circle btn-ghost text-white cursor-pointer"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-base-100 rounded-lg p-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-bold mb-4 text-center">{selectedEvent.title}</h2>
              
              {/* Event Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {selectedEvent.images.map((image, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-lg">
                    <WatermarkedImage
                      src={image}
                      alt={`${selectedEvent.title} - Image ${index + 1}`}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>

              {/* Event Details */}
              <div className="text-center space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base-content/70">
                  <div className="flex items-center justify-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                <p className="text-base-content/80 max-w-4xl mx-auto">
                  {selectedEvent.description}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Events

