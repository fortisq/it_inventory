import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import api from '../services/api';

ChartJS.register(...registerables);

const DataVisualization = () => {
  const [assetData, setAssetData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const assetResponse = await api.get('/api/reports/assets');
      const subscriptionResponse = await api.get('/api/reports/subscriptions');
      setAssetData(assetResponse.data);
      setSubscriptionData(subscriptionResponse.data);
    } catch (error) {
      console.error('Error fetching data for visualization:', error);
    } finally {
      setLoading(false);
    }
  };

  const assetStatusChart = {
    labels: Object.keys(assetData?.assetsByStatus || {}),
    datasets: [
      {
        label: 'Assets by Status',
        data: Object.values(assetData?.assetsByStatus || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
      },
    ],
  };

  const assetTypeChart = {
    labels: Object.keys(assetData?.assetsByType || {}),
    datasets: [
      {
        label: 'Assets by Type',
        data: Object.values(assetData?.assetsByType || {}),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  const subscriptionVendorChart = {
    labels: Object.keys(subscriptionData?.subscriptionsByVendor || {}),
    datasets: [
      {
        label: 'Subscriptions by Vendor',
        data: Object.values(subscriptionData?.subscriptionsByVendor || {}),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  if (loading) {
    return <div>Loading data visualization...</div>;
  }

  return (
    <div>
      <h2>Data Visualization</h2>
      <div style={{ width: '400px', height: '400px' }}>
        <h3>Assets by Status</h3>
        <Pie data={assetStatusChart} />
      </div>
      <div style={{ width: '400px', height: '400px' }}>
        <h3>Assets by Type</h3>
        <Bar data={assetTypeChart} />
      </div>
      <div style={{ width: '400px', height: '400px' }}>
        <h3>Subscriptions by Vendor</h3>
        <Bar data={subscriptionVendorChart} />
      </div>
    </div>
  );
};

export default DataVisualization;
