import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAuth, adminStats } from '../services/adminApi';
import LoadingSpinner from './LoadingSpinner';
import ImageManager from './admin/ImageManager';
import MessageManager from './admin/MessageManager';
import PasswordChangeModal from './admin/PasswordChangeModal';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('images');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = adminAuth.getStoredUser();
        setAdminUser(user);
        
        const statsData = await adminStats.getStats();
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    adminAuth.logout();
    navigate('/admin/login');
  };

  const handlePasswordChangeSuccess = () => {
    setSuccessMessage('Password changed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const tabs = [
    { id: 'images', label: 'Images', badge: null },
    { id: 'messages', label: 'Messages', badge: stats?.unreadMessages }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and User Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="Sankhanil Lens" className="h-8 w-8" />
                <div className="leading-none">
                  <span className="text-xl font-bold text-white block">Sankhanil Lens</span>
                  <span className="text-xs text-gray-400">Admin Panel</span>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-start text-sm border-l border-gray-700 pl-4 leading-none">
                <span className="text-white mb-1">{adminUser?.username}</span>
                <span className="text-gray-400 capitalize text-xs">{adminUser?.role}</span>
              </div>
            </div>
            
            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden md:flex items-center space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-400 bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{tab.label}</span>
                    {tab.badge > 0 && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-semibold">
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </button>
              ))}
              
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
              >
                Change Password
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
              >
                View Site
              </button>
              
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-b border-gray-800"
          >
            <div className="px-4 py-2 space-y-1">
              {/* User Info on Mobile */}
              <div className="px-3 py-2 border-b border-gray-800 mb-2">
                <div className="text-white text-sm font-medium">{adminUser?.username}</div>
                <div className="text-gray-400 text-xs capitalize">{adminUser?.role}</div>
              </div>

              {/* Tabs */}
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center justify-between ${
                    activeTab === tab.id
                      ? 'text-blue-400 bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-semibold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}

              {/* Actions */}
              <button
                onClick={() => {
                  setShowPasswordModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
              >
                Change Password
              </button>

              <button
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
              >
                View Site
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-600 text-white rounded-lg shadow-lg">
            {successMessage}
          </div>
        )}
        
        {activeTab === 'images' && <ImageManager />}
        {activeTab === 'messages' && <MessageManager />}
      </main>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordChangeSuccess}
      />
    </div>
  );
}

export default AdminDashboard;
