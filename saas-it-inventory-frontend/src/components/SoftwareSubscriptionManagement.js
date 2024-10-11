import React, { useState, useEffect } from 'react';
import { getSoftwareSubscriptions, createSoftwareSubscription, updateSoftwareSubscription, deleteSoftwareSubscription } from '../services/api';
import './SoftwareSubscriptionManagement.css';

const SoftwareSubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newSubscription, setNewSubscription] = useState({ name: '', vendor: '', startDate: '', expiryDate: '' });
  const [editingSubscription, setEditingSubscription] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const data = await getSoftwareSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching software subscriptions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubscription({ ...newSubscription, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSoftwareSubscription(newSubscription);
      setNewSubscription({ name: '', vendor: '', startDate: '', expiryDate: '' });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error creating software subscription:', error);
    }
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
  };

  const handleUpdate = async () => {
    try {
      await updateSoftwareSubscription(editingSubscription._id, editingSubscription);
      setEditingSubscription(null);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error updating software subscription:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSoftwareSubscription(id);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error deleting software subscription:', error);
    }
  };

  return (
    <div className="software-subscription-management">
      <h2>Software Subscription Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newSubscription.name}
          onChange={handleInputChange}
          placeholder="Subscription Name"
          required
        />
        <input
          type="text"
          name="vendor"
          value={newSubscription.vendor}
          onChange={handleInputChange}
          placeholder="Vendor"
          required
        />
        <input
          type="date"
          name="startDate"
          value={newSubscription.startDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="expiryDate"
          value={newSubscription.expiryDate}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Subscription</button>
      </form>
      <ul className="subscription-list">
        {subscriptions.map((subscription) => (
          <li key={subscription._id}>
            {editingSubscription && editingSubscription._id === subscription._id ? (
              <div>
                <input
                  type="text"
                  value={editingSubscription.name}
                  onChange={(e) => setEditingSubscription({ ...editingSubscription, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editingSubscription.vendor}
                  onChange={(e) => setEditingSubscription({ ...editingSubscription, vendor: e.target.value })}
                />
                <input
                  type="date"
                  value={editingSubscription.startDate.split('T')[0]}
                  onChange={(e) => setEditingSubscription({ ...editingSubscription, startDate: e.target.value })}
                />
                <input
                  type="date"
                  value={editingSubscription.expiryDate.split('T')[0]}
                  onChange={(e) => setEditingSubscription({ ...editingSubscription, expiryDate: e.target.value })}
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditingSubscription(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>{subscription.name} - {subscription.vendor}</span>
                <span>Start: {new Date(subscription.startDate).toLocaleDateString()}</span>
                <span>Expiry: {new Date(subscription.expiryDate).toLocaleDateString()}</span>
                <button onClick={() => handleEdit(subscription)}>Edit</button>
                <button onClick={() => handleDelete(subscription._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SoftwareSubscriptionManagement;
