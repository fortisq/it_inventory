import React, { useState, useEffect } from 'react';
import { getAssets, getSoftwareSubscriptions } from '../services/api';
import './ReportsAndDashboards.css';

const ReportsAndDashboards = () => {
  const [assets, setAssets] = useState([]);
  const [softwareSubscriptions, setSoftwareSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsData, subscriptionsData] = await Promise.all([
        getAssets(),
        getSoftwareSubscriptions()
      ]);
      setAssets(assetsData);
      setSoftwareSubscriptions(subscriptionsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getExpiringAssets = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return assets.filter(asset => new Date(asset.warrantyExpiryDate) <= thirtyDaysFromNow);
  };

  const getExpiringSoftwareSubscriptions = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return softwareSubscriptions.filter(subscription => new Date(subscription.expiryDate) <= thirtyDaysFromNow);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="reports-and-dashboards">
      <h2>Reports and Dashboards</h2>
      
      <div className="dashboard-section">
        <h3>Asset Overview</h3>
        <p>Total Assets: {assets.length}</p>
        <p>Assets with Expiring Warranty: {getExpiringAssets().length}</p>
      </div>

      <div className="dashboard-section">
        <h3>Software Subscriptions Overview</h3>
        <p>Total Software Subscriptions: {softwareSubscriptions.length}</p>
        <p>Expiring Software Subscriptions: {getExpiringSoftwareSubscriptions().length}</p>
      </div>

      <div className="report-section">
        <h3>Assets with Expiring Warranty</h3>
        <ul>
          {getExpiringAssets().map(asset => (
            <li key={asset._id}>{asset.name} - Expires: {new Date(asset.warrantyExpiryDate).toLocaleDateString()}</li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h3>Expiring Software Subscriptions</h3>
        <ul>
          {getExpiringSoftwareSubscriptions().map(subscription => (
            <li key={subscription._id}>{subscription.name} - Expires: {new Date(subscription.expiryDate).toLocaleDateString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReportsAndDashboards;
