import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { adminAuth } from '../services/adminApi';
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await adminAuth.verify();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
        adminAuth.logout(); // Clear invalid token
      }
    };

    verifyAuth();
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated
  return children;
}

export default ProtectedRoute;
