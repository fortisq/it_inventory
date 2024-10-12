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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => clearMessages();
  }, [clearMessages]);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        clearMessages();
      }, 5000); // Auto-dismiss after 5 seconds
    }
    return () => clearTimeout(timer);
  }, [success, clearMessages]);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getUserGreeting = () => {
    if (!user) return 'Welcome!';
    const name = user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User';
    return `Welcome, ${name}!`;
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>{getUserGreeting()}</p>
      <p>Welcome to your IT Inventory Dashboard!</p>
      <nav>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? 'Close Menu' : 'Open Menu'}
        </button>
        <ul className={`dashboard-menu ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/inventory" onClick={() => setIsMenuOpen(false)}>View Inventory</Link></li>
          <li><Link to="/assets" onClick={() => setIsMenuOpen(false)}>Manage Assets</Link></li>
          <li><Link to="/software-subscriptions" onClick={() => setIsMenuOpen(false)}>Software Subscriptions</Link></li>
          <li><Link to="/reports" onClick={() => setIsMenuOpen(false)}>Reports and Analytics</Link></li>
          {user && user.role === 'admin' && <li><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link></li>}
          <li><Link to="/system-health" onClick={() => setIsMenuOpen(false)}>System Health</Link></li>
        </ul>
      </nav>
      <div className="user-actions">
        <Link to="/profile" className="profile-link">My Profile</Link>
        <button onClick={handleLogout} disabled={isLoading} className="logout-button">
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Logging out...
            </>
          ) : (
            'Logout'
          )}
        </button>
      </div>
      {success && <Message type="success">{success}</Message>}
    </div>
  );
}

export default Dashboard;
