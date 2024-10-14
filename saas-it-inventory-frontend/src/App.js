import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigurationProvider, useConfiguration } from './context/ConfigurationContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Assets from './components/Assets';
import Subscriptions from './components/Subscriptions';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import ConfigurationManagement from './components/ConfigurationManagement';
import Navigation from './components/Navigation';
import Profile from './components/Profile';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppContent = () => {
  const { configurations, loading } = useConfiguration();

  if (loading) {
    return <div>Loading configurations...</div>;
  }

  const appStyle = {
    '--theme-color': configurations.theme_color || '#007bff',
  };

  return (
    <Router>
      <div className="App" style={appStyle}>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <Inventory />
              </PrivateRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <PrivateRoute>
                <Assets />
              </PrivateRoute>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <PrivateRoute>
                <Subscriptions />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/configuration"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <ConfigurationManagement />
                </AdminRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <ConfigurationProvider>
        <AppContent />
      </ConfigurationProvider>
    </AuthProvider>
  );
}

export default App;
