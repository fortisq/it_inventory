import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const ConfigurationManagement = () => {
  const [configurations, setConfigurations] = useState([]);
  const [newConfig, setNewConfig] = useState({ key: '', value: '' });

  const fetchConfigurations = useCallback(async () => {
    try {
      const response = await api.get('/api/configuration');
      setConfigurations(response.data);
    } catch (error) {
      console.error('Error fetching configurations:', error);
    }
  }, []);

  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  const handleInputChange = (e) => {
    setNewConfig({ ...newConfig, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/configuration', newConfig);
      setNewConfig({ key: '', value: '' });
      fetchConfigurations();
    } catch (error) {
      console.error('Error adding configuration:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/configuration/${id}`);
      fetchConfigurations();
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  return (
    <div>
      <h2>Configuration Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="key"
          value={newConfig.key}
          onChange={handleInputChange}
          placeholder="Key"
          required
        />
        <input
          type="text"
          name="value"
          value={newConfig.value}
          onChange={handleInputChange}
          placeholder="Value"
          required
        />
        <button type="submit">Add Configuration</button>
      </form>
      <ul>
        {configurations.map((config) => (
          <li key={config._id}>
            {config.key}: {config.value}
            <button onClick={() => handleDelete(config._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConfigurationManagement;
