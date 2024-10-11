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

  return (
    <nav className="navigation">
      <ul>
        {isAuthenticated ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/subscription">Subscription</Link></li>
            {user && user.role === 'admin' && (
              <li className="admin-menu">
                <button onClick={toggleAdminMenu}>Admin</button>
                {showAdminMenu && (
                  <ul className="admin-submenu">
                    <li><Link to="/admin">Admin Dashboard</Link></li>
                    <li><Link to="/admin/tenants">Tenant Management</Link></li>
                    <li><Link to="/admin/users">User Management</Link></li>
                  </ul>
                )}
              </li>
            )}
            <li><button onClick={logout}>Logout</button></li>
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
