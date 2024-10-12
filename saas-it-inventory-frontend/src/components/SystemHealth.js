import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSystemHealth } from '../services/api';
import './SystemHealth.css';

function SystemHealth() {
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      setIsLoading(true);
      const response = await getSystemHealth();
      setHealthData(response.data);
    } catch (err) {
      setError('Failed to fetch system health data. Please try again later.');
      console.error('System health fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading system health data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="system-health">
      <h2>System Health</h2>
      {healthData && (
        <>
          <section className="health-section">
            <h3>Application</h3>
            <p>Status: {healthData.status}</p>
            <p>Version: {healthData.app.version}</p>
            <p>Uptime: {Math.floor(healthData.app.uptime / 3600)} hours</p>
          </section>
          <section className="health-section">
            <h3>System</h3>
            <p>Platform: {healthData.system.platform}</p>
            <p>Node Version: {healthData.system.nodeVersion}</p>
            <p>CPU Cores: {healthData.system.cpuCores}</p>
            <p>Total Memory: {(healthData.system.totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB</p>
            <p>Free Memory: {(healthData.system.freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB</p>
          </section>
          <section className="health-section">
            <h3>Database</h3>
            <p>Status: {healthData.database.status}</p>
            <p>Name: {healthData.database.name}</p>
            <p>Collections: {healthData.database.collections}</p>
            <p>Documents: {healthData.database.documents}</p>
            <p>Indexes: {healthData.database.indexes}</p>
            <p>Data Size: {(healthData.database.dataSize / 1024 / 1024).toFixed(2)} MB</p>
          </section>
          <section className="health-section">
            <h3>Dependencies</h3>
            <ul>
              {Object.entries(healthData.dependencies).map(([dep, version]) => (
                <li key={dep}>{dep}: {version}</li>
              ))}
            </ul>
          </section>
        </>
      )}
      <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
    </div>
  );
}

export default SystemHealth;
