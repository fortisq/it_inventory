import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute() {
  const { isAuthenticated, user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
