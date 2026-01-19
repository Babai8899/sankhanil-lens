import React from 'react'
import { motion } from 'framer-motion'

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-white">Privacy Policy</h1>
          <p className="text-base-content/70">Last updated: November 29, 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-base-100 rounded-lg shadow-xl p-8 space-y-8"
        >
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              We collect minimal information to provide you with the best experience on Sankhanil Lens. This includes:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
              <li>Browser type and version for optimal display</li>
              <li>Device information for responsive design</li>
              <li>Usage data such as pages visited and time spent</li>
              <li>IP address for security and analytics purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              The information we collect is used to:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
              <li>Improve website functionality and user experience</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Protect against unauthorized access and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Image Protection and Copyright</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              All photographs displayed on this website are protected by copyright and belong to Sankhanil Dhara. We implement technical measures including:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
              <li>Screenshot detection and prevention mechanisms</li>
              <li>Automatic watermarking on unauthorized download attempts</li>
              <li>Secure token-based image delivery</li>
              <li>Right-click and drag protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies and Tracking</h2>
            <p className="text-base-content/80 leading-relaxed">
              This website uses essential cookies and local storage to maintain security tokens and user preferences. We do not use tracking cookies for advertising purposes. Session cookies are automatically deleted when you close your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Services</h2>
            <p className="text-base-content/80 leading-relaxed">
              We use MongoDB Atlas for secure image storage. Your data is encrypted in transit and at rest. We do not share your personal information with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
            <p className="text-base-content/80 leading-relaxed">
              We implement industry-standard security measures including token-based authentication, HTTPS encryption, and secure database connections. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of analytics tracking</li>
              <li>Object to data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <p className="text-base-content/80 leading-relaxed">
              This website is not intended for children under 13 years of age. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Privacy Policy</h2>
            <p className="text-base-content/80 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of the website constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-base-content/80 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-blue-400 mt-2">indra.babai.9898@gmail.com</p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
