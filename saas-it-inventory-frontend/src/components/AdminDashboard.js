import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-links">
        <Link to="/admin/tenants" className="admin-link">
          Tenant Management
        </Link>
        <Link to="/admin/users" className="admin-link">
          User Management
        </Link>
        <Link to="/admin/system-health" className="admin-link">
          System Health
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
