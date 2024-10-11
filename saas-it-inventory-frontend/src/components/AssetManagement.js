import React, { useState, useEffect } from 'react';
import { getAssets, createAsset, updateAsset, deleteAsset } from '../services/api';
import './AssetManagement.css';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({ name: '', type: '', serialNumber: '' });
  const [editingAsset, setEditingAsset] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset({ ...newAsset, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAsset(newAsset);
      setNewAsset({ name: '', type: '', serialNumber: '' });
      fetchAssets();
    } catch (error) {
      console.error('Error creating asset:', error);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
  };

  const handleUpdate = async () => {
    try {
      await updateAsset(editingAsset._id, editingAsset);
      setEditingAsset(null);
      fetchAssets();
    } catch (error) {
      console.error('Error updating asset:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAsset(id);
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  return (
    <div className="asset-management">
      <h2>Asset Management</h2>
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
        <input
          type="text"
          name="serialNumber"
          value={newAsset.serialNumber}
          onChange={handleInputChange}
          placeholder="Serial Number"
          required
        />
        <button type="submit">Add Asset</button>
      </form>
      <ul className="asset-list">
        {assets.map((asset) => (
          <li key={asset._id}>
            {editingAsset && editingAsset._id === asset._id ? (
              <div>
                <input
                  type="text"
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editingAsset.type}
                  onChange={(e) => setEditingAsset({ ...editingAsset, type: e.target.value })}
                />
                <input
                  type="text"
                  value={editingAsset.serialNumber}
                  onChange={(e) => setEditingAsset({ ...editingAsset, serialNumber: e.target.value })}
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditingAsset(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>{asset.name} - {asset.type} (SN: {asset.serialNumber})</span>
                <button onClick={() => handleEdit(asset)}>Edit</button>
                <button onClick={() => handleDelete(asset._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetManagement;
