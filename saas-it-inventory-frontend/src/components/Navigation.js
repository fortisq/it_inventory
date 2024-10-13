import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaBoxes, FaLaptop, FaFileAlt, FaChartBar, FaUsers, FaUserCircle, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  if (!user) return null;

  const NavItem = ({ to, icon, children }) => (
    <li>
      <NavLink to={to} activeClassName="active" onClick={() => setIsMenuOpen(false)}>
        {icon}
        <span>{children}</span>
      </NavLink>
    </li>
  );

  return (
    <nav className="navigation">
      <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <NavItem to="/dashboard" icon={<FaHome />}>Dashboard</NavItem>
        <NavItem to="/inventory" icon={<FaBoxes />}>Inventory</NavItem>
        <NavItem to="/assets" icon={<FaLaptop />}>Assets</NavItem>
        <NavItem to="/software-subscriptions" icon={<FaFileAlt />}>Software Subscriptions</NavItem>
        <NavItem to="/reports" icon={<FaChartBar />}>Reports</NavItem>
        <NavItem to="/data-visualization" icon={<FaChartBar />}>Data Visualization</NavItem>
        {user.role === 'admin' && (
          <NavItem to="/user-management" icon={<FaUsers />}>User Management</NavItem>
        )}
        <li className="dropdown">
          <button className="dropbtn">
            <FaUserCircle />
            <span>{user.username}</span>
          </button>
          <div className="dropdown-content">
            <NavItem to="/profile" icon={<FaUserCircle />}>Profile</NavItem>
            <NavItem to="/help-support" icon={<FaQuestionCircle />}>Help & Support</NavItem>
            <a href="#" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
