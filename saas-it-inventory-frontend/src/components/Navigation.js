import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const toggleAdminMenu = () => {
    setShowAdminMenu(!showAdminMenu);
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <nav className="navigation" aria-label="Main Navigation">
      <ul>
        {isAuthenticated ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/assets">Asset Management</Link></li>
            <li><Link to="/software-subscriptions">Software Subscriptions</Link></li>
            <li><Link to="/subscription">Subscription</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            {user && user.role === 'admin' && (
              <li className="admin-menu">
                <button 
                  onClick={toggleAdminMenu} 
                  aria-haspopup="true" 
                  aria-expanded={showAdminMenu}
                  onKeyDown={(e) => handleKeyDown(e, toggleAdminMenu)}
                >
                  Admin
                </button>
                {showAdminMenu && (
                  <ul className="admin-submenu" aria-label="Admin Submenu">
                    <li><Link to="/admin">Admin Dashboard</Link></li>
                    <li><Link to="/admin/tenants">Tenant Management</Link></li>
                    <li><Link to="/admin/users">User Management</Link></li>
                    <li><Link to="/admin/system-health">System Health</Link></li>
                  </ul>
                )}
              </li>
            )}
            <li>
              <button 
                onClick={logout}
                onKeyDown={(e) => handleKeyDown(e, logout)}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
