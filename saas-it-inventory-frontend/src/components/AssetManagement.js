import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getAssets, createAsset, updateAsset, deleteAsset } from '../services/api';
import './AssetManagement.css';

Modal.setAppElement('#root');

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({ name: '', type: '', serialNumber: '' });
  const [editingAsset, setEditingAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const data = await getAssets();
      setAssets(data);
      setError('');
    } catch (error) {
      setError('Error fetching assets. Please try again.');
      console.error('Error fetching assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset({ ...newAsset, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createAsset(newAsset);
      setNewAsset({ name: '', type: '', serialNumber: '' });
      fetchAssets();
      setSuccess('Asset created successfully');
    } catch (error) {
      setError('Error creating asset. Please try again.');
      console.error('Error creating asset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await updateAsset(editingAsset._id, editingAsset);
      setEditingAsset(null);
      fetchAssets();
      setSuccess('Asset updated successfully');
    } catch (error) {
      setError('Error updating asset. Please try again.');
      console.error('Error updating asset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (asset) => {
    setAssetToDelete(asset);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setAssetToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (assetToDelete) {
      try {
        setIsLoading(true);
        await deleteAsset(assetToDelete._id);
        fetchAssets();
        setSuccess('Asset deleted successfully');
      } catch (error) {
        setError('Error deleting asset. Please try again.');
        console.error('Error deleting asset:', error);
      } finally {
        setIsLoading(false);
        closeDeleteModal();
      }
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return <div className="loading" aria-live="polite">Loading assets...</div>;
  }

  return (
    <div className="asset-management">
      <h2>Asset Management</h2>
      {error && <div className="error" role="alert">{error}</div>}
      {success && <div className="success" role="status">{success}</div>}
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? 'Close Menu' : 'Open Menu'}
      </button>
      <div className={`asset-management-content ${isMenuOpen ? 'open' : ''}`}>
        <form onSubmit={handleSubmit} className="asset-form">
          <label htmlFor="name">Asset Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={newAsset.name}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
          <label htmlFor="type">Asset Type</label>
          <input
            id="type"
            type="text"
            name="type"
            value={newAsset.type}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
          <label htmlFor="serialNumber">Serial Number</label>
          <input
            id="serialNumber"
            type="text"
            name="serialNumber"
            value={newAsset.serialNumber}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : null}
            Add Asset
          </button>
        </form>
        <ul className="asset-list" aria-label="Asset list">
          {assets.map((asset) => (
            <li key={asset._id} className="asset-item">
              {editingAsset && editingAsset._id === asset._id ? (
                <div className="asset-edit">
                  <label htmlFor={`edit-name-${asset._id}`}>Asset Name</label>
                  <input
                    id={`edit-name-${asset._id}`}
                    type="text"
                    value={editingAsset.name}
                    onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  />
                  <label htmlFor={`edit-type-${asset._id}`}>Asset Type</label>
                  <input
                    id={`edit-type-${asset._id}`}
                    type="text"
                    value={editingAsset.type}
                    onChange={(e) => setEditingAsset({ ...editingAsset, type: e.target.value })}
                  />
                  <label htmlFor={`edit-serialNumber-${asset._id}`}>Serial Number</label>
                  <input
                    id={`edit-serialNumber-${asset._id}`}
                    type="text"
                    value={editingAsset.serialNumber}
                    onChange={(e) => setEditingAsset({ ...editingAsset, serialNumber: e.target.value })}
                  />
                  <button onClick={handleUpdate} disabled={isLoading}>
                    {isLoading ? <span className="spinner"></span> : null}
                    Save
                  </button>
                  <button onClick={() => setEditingAsset(null)}>Cancel</button>
                </div>
              ) : (
                <div className="asset-info">
                  <span>{asset.name} - {asset.type} (SN: {asset.serialNumber})</span>
                  <div className="asset-actions">
                    <button 
                      onClick={() => handleEdit(asset)} 
                      aria-label={`Edit ${asset.name}`}
                      onKeyDown={(e) => handleKeyDown(e, () => handleEdit(asset))}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal(asset)} 
                      aria-label={`Delete ${asset.name}`}
                      onKeyDown={(e) => handleKeyDown(e, () => openDeleteModal(asset))}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Asset Confirmation"
        className="delete-modal"
        overlayClassName="delete-modal-overlay"
      >
        <h2 id="delete-modal-title">Confirm Deletion</h2>
        <p id="delete-modal-description">Are you sure you want to delete the asset: {assetToDelete?.name}?</p>
        <div className="modal-actions">
          <button 
            onClick={handleDelete}
            aria-describedby="delete-modal-description"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : null}
            Yes, Delete
          </button>
          <button onClick={closeDeleteModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default AssetManagement;
