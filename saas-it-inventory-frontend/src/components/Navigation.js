import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaBoxes, FaLaptop, FaFileAlt, FaChartBar, FaUsers, FaUserCircle, FaQuestionCircle, FaSignOutAlt, FaCog, FaBars } from 'react-icons/fa';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const NavItem = ({ to, icon, children }) => (
    <li>
      <NavLink to={to} className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMenuOpen(false)}>
        {icon}
        <span>{children}</span>
      </NavLink>
    </li>
  );

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">IT Inventory</div>
        <button className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation">
          <FaBars />
        </button>
        <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <NavItem to="/dashboard" icon={<FaHome />}>Dashboard</NavItem>
          <NavItem to="/inventory" icon={<FaBoxes />}>Inventory</NavItem>
          <NavItem to="/assets" icon={<FaLaptop />}>Assets</NavItem>
          <NavItem to="/subscriptions" icon={<FaFileAlt />}>Subscriptions</NavItem>
          <NavItem to="/reports" icon={<FaChartBar />}>Reports</NavItem>
          <NavItem to="/data-visualization" icon={<FaChartBar />}>Data Visualization</NavItem>
          {user.role === 'admin' && (
            <>
              <NavItem to="/user-management" icon={<FaUsers />}>User Management</NavItem>
              <NavItem to="/configuration-management" icon={<FaCog />}>Configuration Management</NavItem>
            </>
          )}
          <li className="dropdown">
            <button className="dropbtn">
              <FaUserCircle />
              <span>{user.username}</span>
            </button>
            <div className="dropdown-content">
              <NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
                <FaUserCircle />
                <span>Profile</span>
              </NavLink>
              <NavLink to="/help-support" onClick={() => setIsMenuOpen(false)}>
                <FaQuestionCircle />
                <span>Help & Support</span>
              </NavLink>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
