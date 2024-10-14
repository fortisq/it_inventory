import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import './Assets.css';
import AssetSearchBar from './AssetSearchBar';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    location: '',
    assignedTo: '',
    status: '',
    maintenanceFrequency: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: ''
  });
  const [editingAsset, setEditingAsset] = useState(null);
  const [originalEditingAsset, setOriginalEditingAsset] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'in_use', label: 'In Use' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'retired', label: 'Retired' }
  ];

  const maintenanceFrequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' },
    { value: 'custom', label: 'Custom' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/assets', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          searchTerm,
          searchType
        }
      });
      setAssets(response.data.assets || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setError('Failed to fetch assets. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, searchType]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset({ ...newAsset, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/assets', newAsset);
      console.log('Asset added successfully:', response.data);
      setNewAsset({
        name: '',
        type: '',
        serialNumber: '',
        purchaseDate: '',
        purchasePrice: '',
        currentValue: '',
        location: '',
        assignedTo: '',
        status: '',
        maintenanceFrequency: '',
        lastMaintenanceDate: '',
        nextMaintenanceDate: ''
      });
      fetchAssets();
    } catch (error) {
      console.error('Error adding asset:', error);
      setError(`Failed to add asset: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset({ ...asset });
    setOriginalEditingAsset({ ...asset });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAsset({ ...editingAsset, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/assets/${editingAsset._id}`, editingAsset);
      console.log('Asset updated successfully:', response.data);
      setEditingAsset(null);
      setOriginalEditingAsset(null);
      fetchAssets();
    } catch (error) {
      console.error('Error updating asset:', error);
      setError('Failed to update asset. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/api/assets/${id}`);
        fetchAssets();
      } catch (error) {
        console.error('Error deleting asset:', error);
        setError(`Failed to delete asset. ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = useCallback((newSearchTerm, newSearchType) => {
    setCurrentPage(1);
    setSearchTerm(newSearchTerm);
    setSearchType(newSearchType);
  }, []);

  const isEditFormChanged = () => {
    return JSON.stringify(editingAsset) !== JSON.stringify(originalEditingAsset);
  };

  if (loading) {
    return <div className="assets-loading">Loading assets...</div>;
  }

  return (
    <div className="assets">
      <h1 className="assets-title">Asset Tracking</h1>
      {error && <div className="assets-error">{error}</div>}
      <AssetSearchBar onSearch={handleSearch} />
      <form onSubmit={handleSubmit} className="assets-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Asset Name</label>
            <input type="text" id="name" name="name" value={newAsset.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="type">Asset Type</label>
            <input type="text" id="type" name="type" value={newAsset.type} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="serialNumber">Serial Number</label>
            <input type="text" id="serialNumber" name="serialNumber" value={newAsset.serialNumber} onChange={handleInputChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="purchaseDate">Purchase Date</label>
            <input type="date" id="purchaseDate" name="purchaseDate" value={newAsset.purchaseDate} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="purchasePrice">Purchase Price</label>
            <input type="number" id="purchasePrice" name="purchasePrice" value={newAsset.purchasePrice} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="currentValue">Current Value</label>
            <input type="number" id="currentValue" name="currentValue" value={newAsset.currentValue} onChange={handleInputChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={newAsset.location} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="assignedTo">Assigned To</label>
            <input type="text" id="assignedTo" name="assignedTo" value={newAsset.assignedTo} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={newAsset.status} onChange={handleInputChange} required>
              <option value="">Select Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="maintenanceFrequency">Maintenance Frequency</label>
            <select
              id="maintenanceFrequency"
              name="maintenanceFrequency"
              value={newAsset.maintenanceFrequency}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Frequency</option>
              {maintenanceFrequencyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="lastMaintenanceDate">Last Maintenance Date</label>
            <input
              type="date"
              id="lastMaintenanceDate"
              name="lastMaintenanceDate"
              value={newAsset.lastMaintenanceDate}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button type="submit" className="submit-button">Add Asset</button>
      </form>
      <div className="assets-list">
        <h2>Current Assets</h2>
        {assets.length > 0 ? (
          <>
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Next Maintenance</th>
                  <th>Created By</th>
                  <th>Last Updated By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset._id}>
                    <td>{asset.name}</td>
                    <td>{asset.type}</td>
                    <td>{asset.location}</td>
                    <td>{asset.status}</td>
                    <td>{asset.assignedTo}</td>
                    <td>{formatDate(asset.nextMaintenanceDate)}</td>
                    <td>{asset.createdBy?.username || 'Unknown'}</td>
                    <td>{asset.updatedBy?.username || 'Unknown'}</td>
                    <td>
                      <button onClick={() => handleEdit(asset)}>Edit</button>
                      <button onClick={() => handleDelete(asset._id)} className="delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? 'active' : ''}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <p>No assets found.</p>
        )}
      </div>
      {editingAsset && (
        <div className="edit-popup">
          <h2>Edit Asset</h2>
          <form onSubmit={handleEditSubmit}>
            {Object.keys(editingAsset).map((key) => {
              if (key !== '_id' && key !== '__v') {
                if (key === 'status') {
                  return (
                    <div key={key} className="form-group">
                      <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                      <select name={key} value={editingAsset[key]} onChange={handleEditInputChange}>
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  );
                } else if (key === 'maintenanceFrequency') {
                  return (
                    <div key={key} className="form-group">
                      <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                      <select name={key} value={editingAsset[key]} onChange={handleEditInputChange}>
                        {maintenanceFrequencyOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  );
                } else if (key.includes('Date')) {
                  return (
                    <div key={key} className="form-group">
                      <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                      <input
                        type="date"
                        name={key}
                        value={formatDateForInput(editingAsset[key])}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  );
                } else if (key === 'createdBy' || key === 'updatedBy') {
                  return (
                    <div key={key} className="form-group">
                      <label htmlFor={key}>{key === 'createdBy' ? 'CreatedByUsername' : 'UpdatedByUsername'}:</label>
                      <input
                        type="text"
                        name={key}
                        value={editingAsset[key]?.username || 'Unknown'}
                        readOnly
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={key} className="form-group">
                      <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                      <input
                        type={key.includes('Price') || key.includes('Value') ? 'number' : 'text'}
                        name={key}
                        value={editingAsset[key]}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  );
                }
              }
              return null;
            })}
            <div className="edit-popup-buttons">
              {isEditFormChanged() && <button type="submit">Apply Changes</button>}
              <button type="button" onClick={() => setEditingAsset(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Assets;
