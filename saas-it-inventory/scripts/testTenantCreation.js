const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// Import the Tenant model
const Tenant = require('../models/Tenant');

async function testTenantCreation() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create a new tenant
    const newTenant = new Tenant({
      name: `Test Tenant ${Date.now()}`,
      smtpSettings: { secure: false },
      subscriptionStatus: 'trial',
      subscriptionPlan: 'basic',
      userCount: 0,
      assetCount: 0,
      userLimit: 5,
      assetLimit: 100
    });

    // Save the tenant to the database
    console.log('Saving new tenant...');
    const savedTenant = await newTenant.save();
    console.log('Tenant saved successfully:', savedTenant);

    // Retrieve the tenant from the database
    console.log('Retrieving saved tenant...');
    const retrievedTenant = await Tenant.findById(savedTenant._id);
    console.log('Retrieved tenant:', retrievedTenant);

  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } finally {
    // Disconnect from MongoDB
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

testTenantCreation();
