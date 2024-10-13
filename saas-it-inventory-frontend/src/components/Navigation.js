import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserNotifications, getAdminNotifications } from '../services/api';

function Navigation() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (user) {
      try {
        const response = user.role === 'admin' || user.role === 'superadmin'
          ? await getAdminNotifications()
          : await getUserNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    }
  };

  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/assets">Assets</Link></li>
        <li><Link to="/software-subscriptions">Software Subscriptions</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        {user && (user.role === 'admin' || user.role === 'superadmin') && (
          <li><Link to="/admin">Admin Panel</Link></li>
        )}
        <li><Link to="/help-support">Help & Support</Link></li>
        {user ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={logout}>Logout</button></li>
            <li>
              Notifications: {notifications.length}
              {notifications.length > 0 && (
                <ul>
                  {notifications.map((notification, index) => (
                    <li key={index}>{notification.message}</li>
                  ))}
                </ul>
              )}
            </li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
