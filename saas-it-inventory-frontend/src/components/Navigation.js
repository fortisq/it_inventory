import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserNotifications, getAdminNotifications } from '../services/api';
import './Navigation.css';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [userNotifications, setUserNotifications] = useState(0);
  const [adminNotifications, setAdminNotifications] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const userNotifs = await getUserNotifications();
      setUserNotifications(userNotifs.data.length);

      if (user && user.role === 'admin') {
        const adminNotifs = await getAdminNotifications();
        setAdminNotifications(adminNotifs.data.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

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
            <li>
              <Link to="/help-support">
                Help & Support
                {userNotifications > 0 && <span className="notification-badge">{userNotifications}</span>}
              </Link>
            </li>
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
                  {adminNotifications > 0 && <span className="notification-badge">{adminNotifications}</span>}
                </button>
                {showAdminMenu && (
                  <ul className="admin-submenu" aria-label="Admin Submenu">
                    <li><Link to="/admin">Admin Dashboard</Link></li>
                    <li><Link to="/admin/tenants">Tenant Management</Link></li>
                    <li><Link to="/admin/users">User Management</Link></li>
                    <li><Link to="/admin/system-health">System Health</Link></li>
                    <li>
                      <Link to="/admin/help-support">
                        Help & Support Management
                        {adminNotifications > 0 && <span className="notification-badge">{adminNotifications}</span>}
                      </Link>
                    </li>
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
