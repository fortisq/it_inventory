import React, { useState, useEffect } from 'react';
import { useConfiguration } from '../context/ConfigurationContext';
import './ConfigurationManagement.css';
import {
  handleInputChange,
  handleSubmit,
  handleEdit,
  handleCancelEdit,
  handleDelete,
  importantConfigs
} from './ConfigurationHelpers';

const ConfigurationManagement = () => {
  const { configurations, loading, error, updateConfiguration, createConfiguration, deleteConfiguration } = useConfiguration();
  const [editingConfig, setEditingConfig] = useState(null);
  const [newConfig, setNewConfig] = useState({ key: '', value: '', description: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    console.log('Configurations:', configurations);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [configurations, loading, error]);

  useEffect(() => {
    if (error) {
      setMessage({ type: 'error', text: error });
    }
  }, [error]);

  const filterConfigurations = (configs, term) => {
    return Object.entries(configs).filter(([key, value]) =>
      key.toLowerCase().includes(term.toLowerCase()) ||
      value.toString().toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredConfigurations = filterConfigurations(configurations, searchTerm);

  const handleSubmitWrapper = async (e) => {
    try {
      await handleSubmit(e, editingConfig, newConfig, updateConfiguration, createConfiguration, setMessage, setEditingConfig, setNewConfig);
    } catch (error) {
      console.error('Error in handleSubmitWrapper:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDeleteWrapper = async (key) => {
    try {
      await handleDelete(key, deleteConfiguration, setMessage);
    } catch (error) {
      console.error('Error in handleDeleteWrapper:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  console.log('Rendering ConfigurationManagement component');

  return (
    <div className="configuration-management">
      <h2>Configuration Management</h2>
      <button className="help-button" onClick={() => setShowHelp(!showHelp)}>
        {showHelp ? 'Hide Help' : 'Show Help'}
      </button>
      {showHelp && (
        <div className="help-section">
          <h3>About Configuration Management:</h3>
          <p>
            The Configuration Management page allows you to customize various settings of your IT Inventory system.
            These configurations control different aspects of the application's behavior and appearance.
          </p>
          <h3>How to use Configuration Management:</h3>
          <ol>
            <li>View existing configurations: Browse through the list of current configurations.</li>
            <li>Edit configurations: Click the "Edit" button next to a configuration to modify its value.</li>
            <li>Add new configurations: Fill in the form at the top to add a new configuration.</li>
            <li>Delete configurations: Click the "Delete" button next to a configuration to remove it.</li>
            <li>Search: Use the search bar to filter configurations by key or value.</li>
          </ol>
          <h3>Important Configurations:</h3>
          <ul>
            <li><strong>application_title:</strong> Set the title of the application displayed in the navigation bar.</li>
            <li><strong>nav_bar_color:</strong> Set the background color of the navigation bar.</li>
            <li><strong>nav_text_color:</strong> Set the color of the text in the navigation bar.</li>
            <li><strong>assets_page_title:</strong> Set the title of the Assets page.</li>
            <li><strong>inventory_page_title:</strong> Set the title of the Inventory page.</li>
            <li><strong>assets_table_color:</strong> Set the background color of the Assets table.</li>
            <li><strong>items_per_page:</strong> Set the number of items displayed per page in the assets list.</li>
            <li><strong>assets_table_header_color:</strong> Set the background color of the Assets table header.</li>
            <li><strong>assets_table_row_color:</strong> Set the alternating row color in the Assets table.</li>
          </ul>
          <p>Note: Some changes may require a page refresh to take effect.</p>
        </div>
      )}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmitWrapper} className="configuration-form">
        <input
          type="text"
          name="key"
          value={editingConfig ? editingConfig.key : newConfig.key}
          onChange={(e) => handleInputChange(e, editingConfig, setEditingConfig, setNewConfig)}
          placeholder="Key"
          required
          readOnly={!!editingConfig}
        />
        <input
          type="text"
          name="value"
          value={editingConfig ? editingConfig.value : newConfig.value}
          onChange={(e) => handleInputChange(e, editingConfig, setEditingConfig, setNewConfig)}
          placeholder="Value"
          required
        />
        {!editingConfig && (
          <input
            type="text"
            name="description"
            value={newConfig.description}
            onChange={(e) => handleInputChange(e, editingConfig, setEditingConfig, setNewConfig)}
            placeholder="Description (optional)"
          />
        )}
        <button type="submit">{editingConfig ? 'Update' : 'Add'} Configuration</button>
        {editingConfig && (
          <button type="button" onClick={() => handleCancelEdit(setEditingConfig, setNewConfig)}>Cancel Edit</button>
        )}
      </form>
      <input
        type="text"
        className="search-bar"
        placeholder="Search configurations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading configurations...
        </div>
      ) : error ? (
        <div className="error-message">
          Error loading configurations: {error}
        </div>
      ) : (
        <ul className="configuration-list">
          {filteredConfigurations.map(([key, value]) => (
            <li key={key} className={`configuration-item ${importantConfigs.includes(key) ? 'important' : ''}`}>
              <div className="configuration-info">
                <strong>{key}:</strong> {value.toString()}
              </div>
              <div className="configuration-actions">
                <button onClick={() => handleEdit({ key, value }, setEditingConfig, setNewConfig)}>Edit</button>
                <button onClick={() => handleDeleteWrapper(key)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConfigurationManagement;
