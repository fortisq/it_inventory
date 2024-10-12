import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="admin-menu">
        <Link to="/admin/users" className="admin-menu-item">
          <h3>User Management</h3>
          <p>Manage user accounts, roles, and permissions</p>
        </Link>
        <Link to="/admin/tenants" className="admin-menu-item">
          <h3>Tenant Management</h3>
          <p>Manage tenant accounts and settings</p>
        </Link>
        <Link to="/admin/subscriptions" className="admin-menu-item">
          <h3>Subscription Management</h3>
          <p>Manage subscription plans and billing</p>
        </Link>
        <Link to="/admin/settings" className="admin-menu-item">
          <h3>System Settings</h3>
          <p>Configure global system settings</p>
        </Link>
        <Link to="/admin/logs" className="admin-menu-item">
          <h3>System Logs</h3>
          <p>View and analyze system logs</p>
        </Link>
        <Link to="/admin/backups" className="admin-menu-item">
          <h3>Backups</h3>
          <p>Manage system backups and restoration</p>
        </Link>
      </div>
      <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
    </div>
  );
};

export default AdminPanel;
