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
    <div>
      <h2>Dashboard</h2>
      {user && <p>Welcome, {user.firstName} {user.lastName}!</p>}
      <p>Welcome to your IT Inventory Dashboard!</p>
      <nav>
        <ul>
          <li><Link to="/inventory">View Inventory</Link></li>
        </ul>
      </nav>
      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
      {success && <Message type="success">{success}</Message>}
    </div>
  );
}

export default Dashboard;
