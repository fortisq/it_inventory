export const handleInputChange = (e, editingConfig, setEditingConfig, setNewConfig) => {
  const { name, value } = e.target;
  if (editingConfig) {
    setEditingConfig({ ...editingConfig, [name]: value });
  } else {
    setNewConfig(prev => ({ ...prev, [name]: value }));
  }
};

export const handleSubmit = async (e, editingConfig, newConfig, updateConfiguration, createConfiguration, setMessage, setEditingConfig, setNewConfig) => {
  e.preventDefault();
  try {
    if (editingConfig) {
      await updateConfiguration(editingConfig.key, editingConfig.value);
      setMessage({ type: 'success', text: 'Configuration updated successfully.' });
      setEditingConfig(null);
    } else {
      await createConfiguration(newConfig.key, newConfig.value, newConfig.description);
      setMessage({ type: 'success', text: 'New configuration created successfully.' });
      setNewConfig({ key: '', value: '', description: '' });
    }
  } catch (error) {
    setMessage({ type: 'error', text: `Error ${editingConfig ? 'updating' : 'adding'} configuration. Please try again.` });
  }
};

export const handleEdit = (config, setEditingConfig, setNewConfig) => {
  setEditingConfig(config);
  setNewConfig({ key: '', value: '', description: '' });
};

export const handleCancelEdit = (setEditingConfig, setNewConfig) => {
  setEditingConfig(null);
  setNewConfig({ key: '', value: '', description: '' });
};

export const handleDelete = async (key, deleteConfiguration, setMessage) => {
  if (window.confirm(`Are you sure you want to delete the configuration "${key}"?`)) {
    try {
      await deleteConfiguration(key);
      setMessage({ type: 'success', text: 'Configuration deleted successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting configuration. Please try again.' });
    }
  }
};

export const filterConfigurations = (configurations, searchTerm) => {
  return Object.entries(configurations).filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const importantConfigs = ['application_title', 'assets_page_title', 'inventory_page_title', 'assets_table_color', 'items_per_page', 'assets_table_header_color', 'assets_table_row_color'];
