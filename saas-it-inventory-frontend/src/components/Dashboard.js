import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="dashboard-no-data">No dashboard data available.</div>;
  }

  const {
    totalAssets = 0,
    totalInventoryItems = 0,
    activeSoftwareSubscriptions = 0,
    assetDistribution = {},
    inventoryStatus = { inStock: 0, lowStock: 0, outOfStock: 0 }
  } = dashboardData;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Assets</h3>
          <p className="summary-value">{totalAssets}</p>
        </div>
        <div className="summary-card">
          <h3>Total Inventory Items</h3>
          <p className="summary-value">{totalInventoryItems}</p>
        </div>
        <div className="summary-card">
          <h3>Active Software Subscriptions</h3>
          <p className="summary-value">{activeSoftwareSubscriptions}</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Asset Distribution</h3>
          <div className="asset-distribution-chart">
            {Object.entries(assetDistribution).map(([category, count]) => (
              <div key={category} className="asset-bar" style={{ 
                height: `${(count / totalAssets) * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`
              }}>
                <span className="asset-label">{category}</span>
                <span className="asset-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Inventory Status</h3>
          <div className="inventory-status-chart">
            <div className="status-pie-chart" style={{
              background: `conic-gradient(
                #4CAF50 0deg ${(inventoryStatus.inStock / totalInventoryItems) * 360}deg,
                #FFC107 ${(inventoryStatus.inStock / totalInventoryItems) * 360}deg ${((inventoryStatus.inStock + inventoryStatus.lowStock) / totalInventoryItems) * 360}deg,
                #F44336 ${((inventoryStatus.inStock + inventoryStatus.lowStock) / totalInventoryItems) * 360}deg 360deg
              )`
            }}></div>
            <div className="status-legend">
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#4CAF50'}}></span>
                <span>In Stock: {inventoryStatus.inStock}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#FFC107'}}></span>
                <span>Low Stock: {inventoryStatus.lowStock}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#F44336'}}></span>
                <span>Out of Stock: {inventoryStatus.outOfStock}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
