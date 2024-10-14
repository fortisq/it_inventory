import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import './Subscriptions.css';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    provider: '',
    licenseType: '',
    startDate: '',
    endDate: '',
    cost: '',
    numberOfLicenses: '',
    status: '',
    description: ''
  });
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [originalEditingSubscription, setOriginalEditingSubscription] = useState(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/subscriptions', {
        params: { page: currentPage, limit: 10 }
      });
      setSubscriptions(response.data.subscriptions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to fetch subscriptions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubscription({ ...newSubscription, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/subscriptions', newSubscription);
      setNewSubscription({
        name: '',
        provider: '',
        licenseType: '',
        startDate: '',
        endDate: '',
        cost: '',
        numberOfLicenses: '',
        status: '',
        description: ''
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error adding subscription:', error);
      setError('Failed to add subscription. Please try again.');
    }
  };

  const handleEdit = (subscription) => {
    setEditingSubscription({ ...subscription });
    setOriginalEditingSubscription({ ...subscription });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSubscription({ ...editingSubscription, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/subscriptions/${editingSubscription._id}`, editingSubscription);
      setEditingSubscription(null);
      setOriginalEditingSubscription(null);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError('Failed to update subscription. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await api.delete(`/api/subscriptions/${id}`);
        fetchSubscriptions();
      } catch (error) {
        console.error('Error deleting subscription:', error);
        setError('Failed to delete subscription. Please try again.');
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const isEditFormChanged = () => {
    return JSON.stringify(editingSubscription) !== JSON.stringify(originalEditingSubscription);
  };

  if (loading) {
    return <div className="subscriptions-loading">Loading subscriptions...</div>;
  }

  if (error) {
    return <div className="subscriptions-error">{error}</div>;
  }

  return (
    <div className="subscriptions">
      <h1 className="subscriptions-title">Subscriptions</h1>
      <form onSubmit={handleSubmit} className="subscriptions-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Subscription Name</label>
            <input type="text" id="name" name="name" value={newSubscription.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="provider">Provider</label>
            <input type="text" id="provider" name="provider" value={newSubscription.provider} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="licenseType">License Type</label>
            <input type="text" id="licenseType" name="licenseType" value={newSubscription.licenseType} onChange={handleInputChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input type="date" id="startDate" name="startDate" value={newSubscription.startDate} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input type="date" id="endDate" name="endDate" value={newSubscription.endDate} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="cost">Cost</label>
            <input type="number" id="cost" name="cost" value={newSubscription.cost} onChange={handleInputChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="numberOfLicenses">Number of Licenses</label>
            <input type="number" id="numberOfLicenses" name="numberOfLicenses" value={newSubscription.numberOfLicenses} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={newSubscription.status} onChange={handleInputChange} required>
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={newSubscription.description} onChange={handleInputChange}></textarea>
          </div>
        </div>
        <button type="submit" className="submit-button">Add Subscription</button>
      </form>
      <div className="subscriptions-list">
        <h2>Current Subscriptions</h2>
        {subscriptions.length > 0 ? (
          <>
            <table className="subscriptions-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Provider</th>
                  <th>License Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Cost</th>
                  <th>Licenses</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription._id}>
                    <td>{subscription.name}</td>
                    <td>{subscription.provider}</td>
                    <td>{subscription.licenseType}</td>
                    <td>{new Date(subscription.startDate).toLocaleDateString()}</td>
                    <td>{new Date(subscription.endDate).toLocaleDateString()}</td>
                    <td>${subscription.cost.toFixed(2)}</td>
                    <td>{subscription.numberOfLicenses}</td>
                    <td>{subscription.status}</td>
                    <td>
                      <button className="action-button edit-button" onClick={() => handleEdit(subscription)}>Edit</button>
                      <button className="action-button delete-button" onClick={() => handleDelete(subscription._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p>No subscriptions found.</p>
        )}
      </div>
      {editingSubscription && (
        <div className="edit-popup">
          <h2>Edit Subscription</h2>
          <form onSubmit={handleEditSubmit}>
            {Object.keys(editingSubscription).map((key) => {
              if (key !== '_id' && key !== '__v') {
                if (key === 'status') {
                  return (
                    <div key={key} className="form-group">
                      <label htmlFor={`edit-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                      <select id={`edit-${key}`} name={key} value={editingSubscription[key]} onChange={handleEditInputChange}>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  );
                } else if (key.includes('Date')) {
                  return (
                    <div key={key} className="form-group">
                      <label htmlFor={`edit-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                      <input
                        type="date"
                        id={`edit-${key}`}
                        name={key}
                        value={editingSubscription[key].split('T')[0]}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  );
                } else if (key === 'description') {
                  return (
                    <div key={key} className="form-group full-width">
                      <label htmlFor={`edit-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                      <textarea
                        id={`edit-${key}`}
                        name={key}
                        value={editingSubscription[key]}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={key} className="form-group">
                      <label htmlFor={`edit-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                      <input
                        type={key === 'cost' || key === 'numberOfLicenses' ? 'number' : 'text'}
                        id={`edit-${key}`}
                        name={key}
                        value={editingSubscription[key]}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  );
                }
              }
              return null;
            })}
            <div className="edit-popup-buttons">
              {isEditFormChanged() && (
                <button type="submit" className="action-button apply-button">
                  Apply Changes
                </button>
              )}
              <button type="button" className="action-button cancel-button" onClick={() => setEditingSubscription(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
