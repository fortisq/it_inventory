import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Loading from './Loading';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user.firstName}!</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Assets</h3>
          <p>{stats?.totalAssets || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Software Subscriptions</h3>
          <p>{stats?.activeSubscriptions || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p>{stats?.lowStockItems || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
