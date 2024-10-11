import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssets, getLicenses } from '../services/api';

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

  if (isLoading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div>
      <h2>Inventory</h2>
      {error && <p className="error">{error}</p>}
      <h3>Assets</h3>
      {assets.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        <ul>
          {assets.map(asset => (
            <li key={asset._id}>
              {asset.name} - Type: {asset.type}, Serial: {asset.serialNumber}
            </li>
          ))}
        </ul>
      )}
      <h3>Licenses</h3>
      {licenses.length === 0 ? (
        <p>No licenses found.</p>
      ) : (
        <ul>
          {licenses.map(license => (
            <li key={license._id}>
              {license.softwareName} - Key: {license.licenseKey}
            </li>
          ))}
        </ul>
      )}
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
}

export default Inventory;
