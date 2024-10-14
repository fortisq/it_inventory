const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// Import the User and Tenant models
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const tenantService = require('../services/tenantService');

async function testUserCreation() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');

    // Create a new tenant or use an existing one
    let tenant = await Tenant.findOne({ name: 'Test Tenant' });
    if (!tenant) {
      tenant = new Tenant({
        name: 'Test Tenant',
        smtpSettings: { secure: false },
        subscriptionStatus: 'trial',
        subscriptionPlan: 'basic',
        userCount: 0,
        assetCount: 0,
        userLimit: 5,
        assetLimit: 100
      });
      await tenant.save();
      console.log('New tenant created:', tenant);
    } else {
      console.log('Using existing tenant:', tenant);
    }

    // Create a regular user
    const regularUser = new User({
      username: `regularuser${Date.now()}`,
      email: `regularuser${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
      tenantId: tenant._id
    });

    console.log('Saving regular user...');
    const savedRegularUser = await regularUser.save();
    console.log('Regular user saved successfully:', savedRegularUser);

    // Update tenant user count
    await tenantService.updateTenantUserCount(tenant._id, 1);

    // Create a tenant admin user
    const tenantAdminUser = new User({
      username: `tenantadmin${Date.now()}`,
      email: `tenantadmin${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Tenant',
      lastName: 'Admin',
      role: 'tenantadmin',
      tenantId: tenant._id
    });

    console.log('Saving tenant admin user...');
    const savedTenantAdminUser = await tenantAdminUser.save();
    console.log('Tenant admin user saved successfully:', savedTenantAdminUser);

    // Update tenant user count
    await tenantService.updateTenantUserCount(tenant._id, 1);

    // Retrieve and display created users
    console.log('Retrieving created users...');
    const retrievedRegularUser = await User.findById(savedRegularUser._id);
    const retrievedTenantAdminUser = await User.findById(savedTenantAdminUser._id);
    console.log('Retrieved regular user:', retrievedRegularUser);
    console.log('Retrieved tenant admin user:', retrievedTenantAdminUser);

    // Retrieve and display updated tenant
    const updatedTenant = await Tenant.findById(tenant._id);
    console.log('Updated tenant:', updatedTenant);

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

testUserCreation();
