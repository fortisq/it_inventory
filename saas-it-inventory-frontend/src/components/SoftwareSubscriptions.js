import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SoftwareSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    vendor: '',
    licenseType: '',
    expirationDate: '',
    seats: 0,
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/subscriptions');
      setSubscriptions(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewSubscription({ ...newSubscription, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/subscriptions', newSubscription);
      setNewSubscription({
        name: '',
        vendor: '',
        licenseType: '',
        expirationDate: '',
        seats: 0,
        status: 'active'
      });
      fetchSubscriptions();
    } catch (err) {
      setError('Error creating subscription');
      console.error('Error creating subscription:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Software Subscriptions</h2>
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
          type="text"
          name="licenseType"
          value={newSubscription.licenseType}
          onChange={handleInputChange}
          placeholder="License Type"
          required
        />
        <input
          type="date"
          name="expirationDate"
          value={newSubscription.expirationDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="seats"
          value={newSubscription.seats}
          onChange={handleInputChange}
          placeholder="Number of Seats"
          required
        />
        <select
          name="status"
          value={newSubscription.status}
          onChange={handleInputChange}
          required
        >
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button type="submit">Add Subscription</button>
      </form>
      <ul>
        {subscriptions.map((subscription) => (
          <li key={subscription._id}>
            {subscription.name} - {subscription.vendor} - {subscription.licenseType} - 
            Expires: {new Date(subscription.expirationDate).toLocaleDateString()} - 
            Seats: {subscription.seats} - Status: {subscription.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SoftwareSubscriptions;
