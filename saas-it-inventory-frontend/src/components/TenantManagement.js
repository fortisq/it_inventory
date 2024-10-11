import React, { useState, useEffect } from 'react';
import { getTenants, createTenant, updateTenant, deleteTenant, getTenantActivityLogs } from '../services/api';
import './TenantManagement.css';

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [newTenant, setNewTenant] = useState({ name: '', subdomain: '', contactEmail: '', planType: 'basic' });
  const [editingTenant, setEditingTenant] = useState(null);
  const [activityLogs, setActivityLogs] = useState({});

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    const fetchedTenants = await getTenants();
    setTenants(fetchedTenants);
    fetchedTenants.forEach(tenant => fetchTenantActivityLogs(tenant._id));
  };

  const fetchTenantActivityLogs = async (tenantId) => {
    const logs = await getTenantActivityLogs(tenantId);
    setActivityLogs(prev => ({ ...prev, [tenantId]: logs }));
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    await createTenant(newTenant);
    setNewTenant({ name: '', subdomain: '', contactEmail: '', planType: 'basic' });
    fetchTenants();
  };

  const handleUpdateTenant = async (id, updatedData) => {
    await updateTenant(id, updatedData);
    setEditingTenant(null);
    fetchTenants();
  };

  const handleDeleteTenant = async (id) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      await deleteTenant(id);
      fetchTenants();
    }
  };

  const startEditing = (tenant) => {
    setEditingTenant({ ...tenant });
  };

  const cancelEditing = () => {
    setEditingTenant(null);
  };

  return (
    <div className="tenant-management">
      <h2>Tenant Management</h2>
      <form onSubmit={handleCreateTenant} className="tenant-form">
        <input
          type="text"
          placeholder="Tenant Name"
          value={newTenant.name}
          onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Subdomain"
          value={newTenant.subdomain}
          onChange={(e) => setNewTenant({ ...newTenant, subdomain: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Contact Email"
          value={newTenant.contactEmail}
          onChange={(e) => setNewTenant({ ...newTenant, contactEmail: e.target.value })}
          required
        />
        <select
          value={newTenant.planType}
          onChange={(e) => setNewTenant({ ...newTenant, planType: e.target.value })}
          required
        >
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <button type="submit">Create Tenant</button>
      </form>
      <ul className="tenant-list">
        {tenants.map((tenant) => (
          <li key={tenant._id} className="tenant-item">
            {editingTenant && editingTenant._id === tenant._id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateTenant(tenant._id, editingTenant);
              }}>
                <input
                  type="text"
                  value={editingTenant.name}
                  onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  value={editingTenant.subdomain}
                  onChange={(e) => setEditingTenant({ ...editingTenant, subdomain: e.target.value })}
                  required
                />
                <input
                  type="email"
                  value={editingTenant.contactEmail}
                  onChange={(e) => setEditingTenant({ ...editingTenant, contactEmail: e.target.value })}
                  required
                />
                <select
                  value={editingTenant.planType}
                  onChange={(e) => setEditingTenant({ ...editingTenant, planType: e.target.value })}
                  required
                >
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <button type="submit">Save</button>
                <button type="button" onClick={cancelEditing}>Cancel</button>
              </form>
            ) : (
              <>
                <div className="tenant-info">
                  <h3>{tenant.name}</h3>
                  <p>Subdomain: {tenant.subdomain}</p>
                  <p>Contact: {tenant.contactEmail}</p>
                  <p>Plan: {tenant.planType}</p>
                </div>
                <div className="tenant-actions">
                  <button onClick={() => startEditing(tenant)}>Edit</button>
                  <button onClick={() => handleDeleteTenant(tenant._id)}>Delete</button>
                </div>
              </>
            )}
            <div className="activity-logs">
              <h4>Recent Activity</h4>
              <ul>
                {activityLogs[tenant._id]?.slice(0, 5).map((log, index) => (
                  <li key={index}>{log.action} - {new Date(log.timestamp).toLocaleString()}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TenantManagement;
