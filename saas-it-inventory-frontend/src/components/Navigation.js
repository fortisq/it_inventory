import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  if (!user) return null;

  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/assets">Assets</Link></li>
        <li><Link to="/software-subscriptions">Software Subscriptions</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/data-visualization">Data Visualization</Link></li>
        {user.role === 'admin' && <li><Link to="/user-management">User Management</Link></li>}
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/help-support">Help & Support</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navigation;
