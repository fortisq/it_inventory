const Configuration = require('../models/Configuration');
const logger = require('../utils/logger');

exports.getConfigurations = async (req, res) => {
  logger.info('getConfigurations function called');
  try {
    const configurations = await Configuration.find();
    logger.info('Configurations found:', { configurations });
    
    const configObject = configurations.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {});

    logger.info('Configuration object:', { configObject });
    res.json(configObject);
  } catch (error) {
    logger.error('Error in getConfigurations:', error);
    res.status(500).json({ message: 'Error fetching configurations', error: error.message });
  }
};

exports.createConfiguration = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    if (!key || !value) {
      return res.status(400).json({ message: 'Key and value are required' });
    }
    const existingConfig = await Configuration.findOne({ key });
    if (existingConfig) {
      return res.status(400).json({ message: 'Configuration with this key already exists' });
    }
    const newConfiguration = new Configuration({ key, value, description });
    await newConfiguration.save();
    res.status(201).json(newConfiguration);
  } catch (error) {
    logger.error('Error creating configuration:', error);
    res.status(400).json({ message: 'Error creating configuration', error: error.message });
  }
};

exports.updateConfiguration = async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || !value) {
      return res.status(400).json({ message: 'Key and value are required' });
    }
    const updatedConfiguration = await Configuration.findOneAndUpdate(
      { key: key },
      { value: value },
      { new: true }
    );
    if (!updatedConfiguration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    res.json(updatedConfiguration);
  } catch (error) {
    logger.error('Error updating configuration:', error);
    res.status(400).json({ message: 'Error updating configuration', error: error.message });
  }
};

exports.deleteConfiguration = async (req, res) => {
  try {
    const { key } = req.params;
    const deletedConfiguration = await Configuration.findOneAndDelete({ key: key });
    if (!deletedConfiguration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    res.json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    logger.error('Error deleting configuration:', error);
    res.status(500).json({ message: 'Error deleting configuration', error: error.message });
  }
};

exports.initializeDefaultConfigurations = async () => {
  const defaultConfigurations = [
    { key: 'theme_color', value: '#007bff', description: 'Primary color theme for the application' },
    { key: 'items_per_page', value: '20', description: 'Number of items displayed per page in lists' },
    { key: 'enable_notifications', value: 'true', description: 'Toggle system notifications on/off' },
    { key: 'default_currency', value: 'USD', description: 'Default currency for financial calculations' },
    { key: 'maintenance_mode', value: 'false', description: 'Enable/disable maintenance mode for the entire system' },
    { key: 'application_title', value: 'IT Inventory', description: 'Title of the application displayed in the navigation bar' },
    { 
      key: 'systems', 
      value: JSON.stringify([
        'Asset Management',
        'Inventory Management',
        'Subscription Management',
        'User Management',
        'Reporting',
        'Configuration Management'
      ]), 
      description: 'List of systems available in the application' 
    }
  ];

  for (const config of defaultConfigurations) {
    const existingConfig = await Configuration.findOne({ key: config.key });
    if (!existingConfig) {
      await Configuration.create(config);
    }
  }
};

exports.getSystems = async (req, res) => {
  try {
    const systemsConfig = await Configuration.findOne({ key: 'systems' });
    if (!systemsConfig) {
      return res.status(404).json({ message: 'Systems configuration not found' });
    }
    const systems = JSON.parse(systemsConfig.value);
    res.json(systems);
  } catch (error) {
    logger.error('Error fetching systems:', error);
    res.status(500).json({ message: 'Error fetching systems', error: error.message });
  }
};

exports.getApplicationTitle = async (req, res) => {
  try {
    logger.info('Fetching application title');
    const titleConfig = await Configuration.findOne({ key: 'application_title' });
    if (!titleConfig) {
      logger.warn('Application title configuration not found');
      return res.status(404).json({ message: 'Application title configuration not found' });
    }
    logger.info('Sending application title:', titleConfig.value);
    res.json({ title: titleConfig.value });
  } catch (error) {
    logger.error('Error fetching application title:', error);
    res.status(500).json({ message: 'Error fetching application title', error: error.message });
  }
};

// Call this function when the server starts
exports.initializeDefaultConfigurations().catch(error => {
  logger.error('Error initializing default configurations:', error);
});
