import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { getTenantStats, getUserStats, getAssetStats } from '../services/api';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [tenantStats, setTenantStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [assetStats, setAssetStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const fetchedTenantStats = await getTenantStats();
    const fetchedUserStats = await getUserStats();
    const fetchedAssetStats = await getAssetStats();

    setTenantStats(fetchedTenantStats);
    setUserStats(fetchedUserStats);
    setAssetStats(fetchedAssetStats);
  };

  const tenantData = {
    labels: ['Basic', 'Pro', 'Enterprise'],
    datasets: [
      {
        data: tenantStats ? [tenantStats.basic, tenantStats.pro, tenantStats.enterprise] : [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  const userData = {
    labels: userStats ? userStats.map(stat => stat.date) : [],
    datasets: [
      {
        label: 'New Users',
        data: userStats ? userStats.map(stat => stat.count) : [],
        backgroundColor: 'rgba(75,192,192,0.6)',
      }
    ]
  };

  const assetData = {
    labels: assetStats ? Object.keys(assetStats) : [],
    datasets: [
      {
        label: 'Asset Count',
        data: assetStats ? Object.values(assetStats) : [],
        backgroundColor: 'rgba(153,102,255,0.6)',
      }
    ]
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-item">
          <h3>Tenant Distribution</h3>
          {tenantStats && <Pie data={tenantData} />}
        </div>
        <div className="dashboard-item">
          <h3>New Users (Last 7 Days)</h3>
          {userStats && <Bar data={userData} />}
        </div>
        <div className="dashboard-item">
          <h3>Asset Distribution</h3>
          {assetStats && <Bar data={assetData} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
