import React from 'react'
import { motion } from 'framer-motion'

function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-white">Terms and Conditions</h1>
          <p className="text-base-content/70">Last updated: November 29, 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-base-100 rounded-lg shadow-xl p-8 space-y-8"
        >
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-base-content/80 leading-relaxed">
              By accessing and using Sankhanil Lens ("the Website"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use this Website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Copyright and Intellectual Property</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              All photographs, images, graphics, text, and other content on this Website are the exclusive property of Sankhanil Dhara and are protected by international copyright laws.
            </p>
            <p className="text-base-content/80 leading-relaxed mb-4 font-semibold">
              You are strictly prohibited from:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
              <li>Downloading, copying, or reproducing any images or content</li>
              <li>Taking screenshots or screen captures of the Website content</li>
              <li>Using any images for commercial or personal purposes without written permission</li>
              <li>Removing or altering watermarks or copyright notices</li>
              <li>Distributing, sharing, or publishing images from this Website</li>
              <li>Creating derivative works based on the Website content</li>
              <li>Using automated tools, bots, or scrapers to access or download content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Image Protection Measures</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              This Website employs advanced protection technologies including:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
              <li>Screenshot detection and prevention systems</li>
              <li>Automatic watermarking on unauthorized access attempts</li>
              <li>Right-click and drag protection</li>
              <li>Token-based secure image delivery</li>
              <li>Browser devtools monitoring</li>
            </ul>
            <p className="text-base-content/80 leading-relaxed mt-4">
              Attempts to bypass or circumvent these protection measures are strictly prohibited and may result in legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Permitted Use</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              You may use this Website only for:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
              <li>Personal, non-commercial viewing of photography</li>
              <li>Contacting the photographer for licensing inquiries</li>
              <li>Sharing links to the Website (not direct image links)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Licensing and Permissions</h2>
            <p className="text-base-content/80 leading-relaxed">
              If you wish to use any images for commercial purposes, exhibitions, publications, or personal projects, you must obtain written permission from Sankhanil Dhara. Contact us for licensing inquiries and rates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Prohibited Activities</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              You must not:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
              <li>Attempt to hack, reverse engineer, or bypass security measures</li>
              <li>Use the Website for any illegal purposes</li>
              <li>Impersonate the photographer or claim ownership of the images</li>
              <li>Use excessive bandwidth or disrupt Website operations</li>
              <li>Share authentication tokens or access credentials</li>
              <li>Frame or embed Website content on other websites</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Copyright Infringement</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              Unauthorized use of any content from this Website constitutes copyright infringement and may result in:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
              <li>Immediate termination of access</li>
              <li>Legal action and damages</li>
              <li>Criminal prosecution under applicable laws</li>
              <li>Reporting to relevant authorities and platforms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-base-content/80 leading-relaxed">
              This Website is provided "as is" without warranties of any kind. While we strive for accuracy and reliability, we do not guarantee uninterrupted access or error-free operation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-base-content/80 leading-relaxed">
              Sankhanil Dhara and Sankhanil Lens shall not be liable for any indirect, incidental, special, or consequential damages arising from your use or inability to use the Website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
            <p className="text-base-content/80 leading-relaxed">
              These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your City], India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
            <p className="text-base-content/80 leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the Website constitutes acceptance of any changes.
            </p>
          </section>


          <section className="border-t border-base-content/20 pt-6">
            <p className="text-base-content/60 text-sm italic">
              By using this Website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsAndConditions
