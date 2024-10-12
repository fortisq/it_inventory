import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssets, getLicenses } from '../services/api';
import './Inventory.css';

function Inventory() {
  const [assets, setAssets] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const [assetsResponse, licensesResponse] = await Promise.all([
        getAssets(),
        getLicenses()
      ]);
      setAssets(assetsResponse.data);
      setLicenses(licensesResponse.data);
    } catch (error) {
      setError('Failed to fetch inventory data. Please try again later.');
      console.error('Inventory fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inventory">
      <h2>Inventory</h2>
      {isLoading ? (
        <div className="loading">Loading inventory...</div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <section className="inventory-section">
            <h3>Assets</h3>
            {assets.length === 0 ? (
              <p>No assets found.</p>
            ) : (
              <ul className="inventory-list">
                {assets.map(asset => (
                  <li key={asset._id} className="inventory-item">
                    <strong>{asset.name}</strong>
                    <span>Type: {asset.type}</span>
                    <span>Serial: {asset.serialNumber}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="inventory-section">
            <h3>Licenses</h3>
            {licenses.length === 0 ? (
              <p>No licenses found.</p>
            ) : (
              <ul className="inventory-list">
                {licenses.map(license => (
                  <li key={license._id} className="inventory-item">
                    <strong>{license.softwareName}</strong>
                    <span>Key: {license.licenseKey}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
      <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
    </div>
  );
}

export default Inventory;
