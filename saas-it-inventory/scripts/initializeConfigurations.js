const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Configuration = require('../models/Configuration');

dotenv.config();

async function initializeConfigurations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const defaultConfigurations = [
      { key: 'theme_color', value: '#007bff', description: 'Primary theme color' },
      { key: 'company_name', value: 'IT Inventory Inc.', description: 'Company name' },
      { key: 'default_currency', value: 'USD', description: 'Default currency for financial calculations' },
      { key: 'license_expiry_warning_days', value: '30', description: 'Days before license expiry to show warning' },
      { key: 'enable_email_notifications', value: 'true', description: 'Enable email notifications for various events' },
    ];

    for (const config of defaultConfigurations) {
      await Configuration.findOneAndUpdate(
        { key: config.key },
        { $setOnInsert: config },
        { upsert: true, new: true }
      );
      console.log(`Configuration '${config.key}' initialized`);
    }

    console.log('All default configurations have been initialized');
  } catch (error) {
    console.error('Error initializing configurations:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initializeConfigurations();
