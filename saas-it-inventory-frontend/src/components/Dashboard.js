/**
 * SaaS IT Inventory Application - Dashboard Component
 * 
 * Copyright (c) 2024 Dan Bressers, NIT Solutions Ltd
 * 
 * This file is part of the SaaS IT Inventory Application.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Message from './Message';
import './Dashboard.css';

function Dashboard() {
  const { user, logout, success, clearMessages } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => clearMessages();
  }, [clearMessages]);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };

  useEffect(() => {
    if (success === 'Logout successful') {
      navigate('/login');
    }
  }, [success, navigate]);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {user && <p>Welcome, {user.firstName} {user.lastName}!</p>}
      <p>Welcome to your IT Inventory Dashboard!</p>
      <nav>
        <ul className="dashboard-menu">
          <li><Link to="/inventory">View Inventory</Link></li>
          <li><Link to="/assets">Manage Assets</Link></li>
          <li><Link to="/software-subscriptions">Software Subscriptions</Link></li>
          <li><Link to="/reports">Reports and Analytics</Link></li>
          {user.role === 'admin' && <li><Link to="/admin">Admin Panel</Link></li>}
          <li><Link to="/system-health">System Health</Link></li>
        </ul>
      </nav>
      <div className="user-actions">
        <Link to="/profile" className="profile-link">My Profile</Link>
        <button onClick={handleLogout} disabled={isLoading} className="logout-button">
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
      {success && <Message type="success">{success}</Message>}
    </div>
  );
}

export default Dashboard;
