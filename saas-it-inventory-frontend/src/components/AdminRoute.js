import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute() {
  const { isAuthenticated, isAdmin, user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated() && isAdmin() ? <Outlet /> : <Navigate to="/dashboard" />;
}

export default AdminRoute;
