import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SoftwareSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    vendor: '',
    licenseType: '',
    expirationDate: '',
    seats: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage, searchTerm]);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get(`/api/software-subscriptions?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      setSubscriptions(response.data.subscriptions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching software subscriptions:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewSubscription({ ...newSubscription, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/software-subscriptions', newSubscription);
      setNewSubscription({
        name: '',
        vendor: '',
        licenseType: '',
        expirationDate: '',
        seats: 0
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error adding software subscription:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      <h2>Software Subscriptions</h2>
      <input
        type="text"
        placeholder="Search subscriptions..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newSubscription.name}
          onChange={handleInputChange}
          placeholder="Software Name"
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
        <button type="submit">Add Subscription</button>
      </form>
      <ul>
        {subscriptions.map((subscription) => (
          <li key={subscription._id}>
            {subscription.name} - {subscription.vendor} - {subscription.licenseType} - 
            Expires: {new Date(subscription.expirationDate).toLocaleDateString()} - 
            Seats: {subscription.seats}
          </li>
        ))}
      </ul>
      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={currentPage === page}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SoftwareSubscriptions;
