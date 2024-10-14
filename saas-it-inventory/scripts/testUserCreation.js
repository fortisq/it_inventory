const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3000';
const MONGODB_URI = process.env.MONGODB_URI;

console.log('Environment variables:');
console.log('API_URL:', API_URL);
console.log('MONGODB_URI:', MONGODB_URI);

const User = require('../models/User');
const Tenant = require('../models/Tenant');
const tenantService = require('../services/tenantService');

async function removeSubdomainIndex() {
  try {
    await Tenant.collection.dropIndex('subdomain_1');
    console.log('Subdomain index removed successfully');
  } catch (error) {
    if (error.code === 27) {
      console.log('Subdomain index does not exist');
    } else {
      console.error('Error removing subdomain index:', error);
    }
  }
}

async function loginAsAdmin() {
  try {
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'root',
      password: 'root'
    });
    console.log('Login response:', loginResponse.data);
    return loginResponse.data.token;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function createUser(userData, token) {
  try {
    console.log('Attempting to create user with data:', userData);
    const response = await axios.post(`${API_URL}/api/users`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('User created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function createTenantDirectly(tenantData) {
  try {
    const existingTenant = await Tenant.findOne({ name: tenantData.name });
    if (existingTenant) {
      console.log('Tenant already exists:', existingTenant);
      return existingTenant;
    }
    const newTenant = new Tenant(tenantData);
    const savedTenant = await newTenant.save();
    console.log('Tenant created directly in database:', savedTenant);
    return savedTenant;
  } catch (error) {
    console.error('Error creating tenant directly:', error);
    return null;
  }
}

async function createUserDirectly(userData) {
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    console.log('User created directly in database:', savedUser);
    return savedUser;
  } catch (error) {
    console.error('Error creating user directly:', error);
    return null;
  }
}

async function queryDatabase() {
  console.log('Querying database for existing users and tenants...');
  const users = await User.find().lean();
  const tenants = await Tenant.find().lean();
  console.log('Existing users:', users);
  console.log('Existing tenants:', tenants);
}

async function testUserCreation() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Remove subdomain index
    await removeSubdomainIndex();

    await queryDatabase();

    console.log('Attempting to login as admin...');
    const token = await loginAsAdmin();
    console.log('Logged in successfully, token:', token);

    // Test Case 1: Create a tenant directly in the database
    console.log('Test Case 1: Creating tenant directly in the database...');
    const newTenant = await createTenantDirectly({
      name: 'Test Tenant Direct',
      subscriptionStatus: 'trial',
      subscriptionPlan: 'basic'
    });

    // Test Case 2: Create a regular user associated with the new tenant
    if (newTenant) {
      console.log('Test Case 2: Creating regular user...');
      const regularUser = {
        username: `regularuser${Date.now()}`,
        email: `regularuser${Date.now()}@example.com`,
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
        tenantId: newTenant._id
      };
      const createdRegularUser = await createUser(regularUser, token);
      if (createdRegularUser) {
        console.log('Regular user created:', createdRegularUser);
        console.log('Regular user tenant:', await tenantService.getTenantById(createdRegularUser.tenantId));
      }
    }

    // Test Case 3: Create a tenant admin user without specifying a tenant
    console.log('Test Case 3: Creating tenant admin user...');
    const tenantAdminUser = {
      username: `tenantadmin${Date.now()}`,
      email: `tenantadmin${Date.now()}@example.com`,
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Tenant',
      lastName: 'Admin',
      role: 'tenantadmin'
    };
    const createdTenantAdminUser = await createUser(tenantAdminUser, token);
    if (createdTenantAdminUser) {
      console.log('Tenant admin user created:', createdTenantAdminUser);
      console.log('Tenant admin user tenant:', await tenantService.getTenantById(createdTenantAdminUser.tenantId));
    }

    // Test Case 4: Attempt to create a superadmin user (should fail)
    console.log('Test Case 4: Attempting to create superadmin user (should fail)...');
    const superAdminUser = {
      username: `superadmin${Date.now()}`,
      email: `superadmin${Date.now()}@example.com`,
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'superadmin'
    };
    const createdSuperAdminUser = await createUser(superAdminUser, token);
    if (createdSuperAdminUser) {
      console.log('Superadmin user created:', createdSuperAdminUser);
      console.log('Superadmin user tenant:', createdSuperAdminUser.tenantId ? await tenantService.getTenantById(createdSuperAdminUser.tenantId) : 'No tenant assigned');
    } else {
      console.log('Superadmin user creation failed as expected.');
    }

    // Test Case 5: Create a user directly in the database
    if (newTenant) {
      console.log('Test Case 5: Creating user directly in the database...');
      const directUser = await createUserDirectly({
        username: `directuser${Date.now()}`,
        email: `directuser${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Direct',
        lastName: 'User',
        role: 'user',
        tenantId: newTenant._id
      });
      if (directUser) {
        console.log('Direct user created:', directUser);
        console.log('Direct user tenant:', await tenantService.getTenantById(directUser.tenantId));
      }
    }

    // Test Case 6: Attempt to create a user with an invalid tenant ID
    console.log('Test Case 6: Attempting to create a user with an invalid tenant ID...');
    const invalidTenantUser = {
      username: `invalidtenantuser${Date.now()}`,
      email: `invalidtenantuser${Date.now()}@example.com`,
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Invalid',
      lastName: 'Tenant',
      role: 'user',
      tenantId: 'invalid_tenant_id'
    };
    const createdInvalidTenantUser = await createUser(invalidTenantUser, token);
    if (createdInvalidTenantUser) {
      console.log('User with invalid tenant ID created (unexpected):', createdInvalidTenantUser);
    } else {
      console.log('User creation with invalid tenant ID failed as expected.');
    }

    await queryDatabase();

  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

testUserCreation();
