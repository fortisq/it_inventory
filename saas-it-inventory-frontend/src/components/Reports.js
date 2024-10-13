import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
  const [assetSummary, setAssetSummary] = useState({});
  const [subscriptionSummary, setSubscriptionSummary] = useState({});

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const assetResponse = await api.get('/api/reports/assets');
      setAssetSummary(assetResponse.data);

      const subscriptionResponse = await api.get('/api/reports/subscriptions');
      setSubscriptionSummary(subscriptionResponse.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  return (
    <div>
      <h2>Reports</h2>
      <div>
        <h3>Asset Summary</h3>
        <p>Total Assets: {assetSummary.totalAssets}</p>
        <p>Assets by Status:</p>
        <ul>
          {Object.entries(assetSummary.assetsByStatus || {}).map(([status, count]) => (
            <li key={status}>{status}: {count}</li>
          ))}
        </ul>
        <p>Assets by Type:</p>
        <ul>
          {Object.entries(assetSummary.assetsByType || {}).map(([type, count]) => (
            <li key={type}>{type}: {count}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Software Subscription Summary</h3>
        <p>Total Subscriptions: {subscriptionSummary.totalSubscriptions}</p>
        <p>Total Seats: {subscriptionSummary.totalSeats}</p>
        <p>Subscriptions by Vendor:</p>
        <ul>
          {Object.entries(subscriptionSummary.subscriptionsByVendor || {}).map(([vendor, count]) => (
            <li key={vendor}>{vendor}: {count}</li>
          ))}
        </ul>
        <p>Expiring Soon (Next 30 Days): {subscriptionSummary.expiringSoon}</p>
      </div>
    </div>
  );
};

export default Reports;
