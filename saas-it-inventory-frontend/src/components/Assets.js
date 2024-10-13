import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({ name: '', type: '', status: '', assignedTo: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssets();
  }, [currentPage, searchTerm]);

  const fetchAssets = async () => {
    try {
      const response = await api.get(`/api/assets?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      setAssets(response.data.assets);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewAsset({ ...newAsset, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/assets', newAsset);
      setNewAsset({ name: '', type: '', status: '', assignedTo: '' });
      fetchAssets();
    } catch (error) {
      console.error('Error adding asset:', error);
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
      <h2>Assets</h2>
      <input
        type="text"
        placeholder="Search assets..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newAsset.name}
          onChange={handleInputChange}
          placeholder="Asset Name"
          required
        />
        <input
          type="text"
          name="type"
          value={newAsset.type}
          onChange={handleInputChange}
          placeholder="Asset Type"
          required
        />
        <select
          name="status"
          value={newAsset.status}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <input
          type="text"
          name="assignedTo"
          value={newAsset.assignedTo}
          onChange={handleInputChange}
          placeholder="Assigned To"
        />
        <button type="submit">Add Asset</button>
      </form>
      <ul>
        {assets.map((asset) => (
          <li key={asset._id}>
            {asset.name} - {asset.type} - {asset.status} - Assigned to: {asset.assignedTo}
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

export default Assets;
