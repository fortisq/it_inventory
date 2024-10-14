import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConfiguration } from '../context/ConfigurationContext';
import './Navigation.css';
import { FaBox, FaClipboardList, FaFileInvoiceDollar, FaChartBar, FaUsers, FaCog, FaUser, FaSignOutAlt, FaCaretDown, FaTachometerAlt } from 'react-icons/fa';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { getConfigValue, getNavLinks } = useConfiguration();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const applicationTitle = getConfigValue('application_title', 'IT Inventory');
  const navLinks = getNavLinks();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Hide navigation on login page
  if (location.pathname === '/login') {
    return null;
  }

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'dashboard': return <FaTachometerAlt />;
      case 'assets': return <FaBox />;
      case 'inventory': return <FaClipboardList />;
      case 'subscriptions': return <FaFileInvoiceDollar />;
      case 'reports': return <FaChartBar />;
      case 'user management': return <FaUsers />;
      case 'configuration': return <FaCog />;
      default: return null;
    }
  };

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Assets', path: '/assets' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Subscriptions', path: '/subscriptions' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/">{applicationTitle}</Link>
        </div>
        {user && (
          <ul className="navbar-nav">
            {mainNavItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link to={item.path}>
                  {getIcon(item.name)} {item.name}
                </Link>
              </li>
            ))}
            {user.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link to="/user-management"><FaUsers /> User Management</Link>
                </li>
                <li className="nav-item">
                  <Link to="/configuration"><FaCog /> Configuration</Link>
                </li>
              </>
            )}
            <li className="nav-item user-dropdown">
              <button onClick={toggleDropdown} className="dropdown-toggle">
                <FaUser /> <span className="user-name">{user.name}</span> <FaCaretDown />
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile"><FaUser /> Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
