import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyConfigurations, getConfigValue, getNavLinks } from '../utils/ConfigurationManager';
import config from '../config';

const ConfigurationContext = createContext();

export const useConfiguration = () => useContext(ConfigurationContext);

export const ConfigurationProvider = ({ children }) => {
  const [configurations, setConfigurations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  useEffect(() => {
    if (Object.keys(configurations).length > 0) {
      applyConfigurations(configurations);
    }
  }, [configurations]);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchConfigurations = async () => {
    try {
      console.log('Fetching configurations...');
      console.log('API URL:', `${config.apiUrl}/api/configuration`);
      const token = getAuthToken();
      const response = await fetch(`${config.apiUrl}/api/configuration`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched configurations:', data);
      setConfigurations(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching configurations:', error);
      setError('Failed to fetch configurations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateConfiguration = async (key, value) => {
    try {
      console.log(`Updating configuration: ${key} = ${value}`);
      const token = getAuthToken();
      const response = await fetch(`${config.apiUrl}/api/configuration`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key, value }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setConfigurations(prev => ({ ...prev, [key]: value }));
      console.log('Configuration updated successfully');
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw error;
    }
  };

  const createConfiguration = async (key, value, description) => {
    try {
      console.log(`Creating configuration: ${key} = ${value}`);
      const token = getAuthToken();
      const response = await fetch(`${config.apiUrl}/api/configuration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key, value, description }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setConfigurations(prev => ({ ...prev, [key]: value }));
      console.log('Configuration created successfully');
    } catch (error) {
      console.error('Error creating configuration:', error);
      throw error;
    }
  };

  const deleteConfiguration = async (key) => {
    try {
      console.log(`Deleting configuration: ${key}`);
      const token = getAuthToken();
      const response = await fetch(`${config.apiUrl}/api/configuration/${key}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setConfigurations(prev => {
        const newConfigs = { ...prev };
        delete newConfigs[key];
        return newConfigs;
      });
      console.log('Configuration deleted successfully');
    } catch (error) {
      console.error('Error deleting configuration:', error);
      throw error;
    }
  };

  const value = {
    configurations,
    loading,
    error,
    updateConfiguration,
    createConfiguration,
    deleteConfiguration,
    getConfigValue: (key, defaultValue) => getConfigValue(configurations, key, defaultValue),
    getNavLinks: () => getNavLinks(configurations),
  };

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
};
