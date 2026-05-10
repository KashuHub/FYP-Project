import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, hostOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-wrapper" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  if (hostOnly && !['host', 'admin'].includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
