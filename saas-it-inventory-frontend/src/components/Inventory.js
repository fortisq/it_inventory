import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssets, getLicenses } from '../services/api';
import './Inventory.css';

function Inventory() {
  const [assets, setAssets] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchInventory();
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

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const [assetsResponse, licensesResponse] = await Promise.all([
        getAssets(),
        getLicenses()
      ]);
      setAssets(assetsResponse.data);
      setLicenses(licensesResponse.data);
      setSuccess('Inventory data fetched successfully');
    } catch (error) {
      setError('Failed to fetch inventory data. Please try again later.');
      console.error('Inventory fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="inventory">
      <h2>Inventory</h2>
      {error && <div className="error" role="alert">{error}</div>}
      {success && <div className="success" role="status">{success}</div>}
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? 'Close Menu' : 'Open Menu'}
      </button>
      <div className={`inventory-content ${isMenuOpen ? 'open' : ''}`}>
        {isLoading ? (
          <div className="loading" aria-live="polite">
            <span className="spinner"></span>
            Loading inventory...
          </div>
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
    </div>
  );
}

export default Inventory;
