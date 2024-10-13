import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import HelpSupport from './components/HelpSupport';
import Reports from './components/Reports';
import Subscription from './components/Subscription';
import SoftwareSubscriptions from './components/SoftwareSubscriptions';
import Assets from './components/Assets';
import Inventory from './components/Inventory';
import SystemHealth from './components/SystemHealth';
import AdminPanel from './components/AdminPanel';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/help-support" element={<PrivateRoute><HelpSupport /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
            <Route path="/software-subscriptions" element={<PrivateRoute><SoftwareSubscriptions /></PrivateRoute>} />
            <Route path="/assets" element={<PrivateRoute><Assets /></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
            <Route path="/system-health" element={<PrivateRoute><SystemHealth /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
