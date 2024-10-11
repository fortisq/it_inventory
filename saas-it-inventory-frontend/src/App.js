import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import AdminDashboard from './components/AdminDashboard';
import TenantManagement from './components/TenantManagement';
import UserManagement from './components/UserManagement';
import SubscriptionManagement from './components/SubscriptionManagement';
import AssetManagement from './components/AssetManagement';
import SoftwareSubscriptionManagement from './components/SoftwareSubscriptionManagement';
import ReportsAndDashboards from './components/ReportsAndDashboards';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Message from './components/Message';
import './App.css';

function MessageContainer() {
  const { error, success, clearError, clearSuccess } = useAuth();

  return (
    <div className="message-container">
      {error && (
        <Message type="error" onDismiss={clearError}>
          {error}
        </Message>
      )}
      {success && (
        <Message type="success" onDismiss={clearSuccess}>
          {success}
        </Message>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <MessageContainer />
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/subscription" element={<SubscriptionManagement />} />
                <Route path="/assets" element={<AssetManagement />} />
                <Route path="/software-subscriptions" element={<SoftwareSubscriptionManagement />} />
                <Route path="/reports" element={<ReportsAndDashboards />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/tenants" element={<TenantManagement />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Route>
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
