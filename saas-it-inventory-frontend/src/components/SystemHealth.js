import React, { useState, useEffect } from 'react';
import { getSystemHealth } from '../services/api';
import './SystemHealth.css';

const SystemHealth = () => {
  const [healthInfo, setHealthInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        const data = await getSystemHealth();
        setHealthInfo(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch system health information');
        setLoading(false);
      }
    };

    fetchHealthInfo();
  }, []);

  if (loading) return <div>Loading system health information...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!healthInfo) return null;

  return (
    <div className="system-health">
      <h2>System Health</h2>
      <div className="health-section">
        <h3>Application</h3>
        <p>Status: {healthInfo.status}</p>
        <p>Version: {healthInfo.app.version}</p>
        <p>Uptime: {Math.floor(healthInfo.app.uptime / 3600)} hours</p>
      </div>
      <div className="health-section">
        <h3>System</h3>
        <p>Platform: {healthInfo.system.platform}</p>
        <p>Node Version: {healthInfo.system.nodeVersion}</p>
        <p>CPU Cores: {healthInfo.system.cpuCores}</p>
        <p>Total Memory: {(healthInfo.system.totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB</p>
        <p>Free Memory: {(healthInfo.system.freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB</p>
      </div>
      <div className="health-section">
        <h3>Database</h3>
        <p>Status: {healthInfo.database.status}</p>
        <p>Name: {healthInfo.database.name}</p>
        <p>Collections: {healthInfo.database.collections}</p>
        <p>Documents: {healthInfo.database.documents}</p>
        <p>Indexes: {healthInfo.database.indexes}</p>
        <p>Data Size: {(healthInfo.database.dataSize / 1024 / 1024).toFixed(2)} MB</p>
      </div>
      <div className="health-section">
        <h3>Dependencies</h3>
        <ul>
          {Object.entries(healthInfo.dependencies).map(([dep, version]) => (
            <li key={dep}>{dep}: {version}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SystemHealth;
