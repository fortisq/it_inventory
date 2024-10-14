const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3000';
const MONGODB_URI = process.env.MONGODB_URI;

const User = require('../models/User');
const Tenant = require('../models/Tenant');

function generateUniqueUsername(baseName) {
  return `${baseName}_${Date.now()}`;
}

async function loginAsAdmin() {
  try {
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'root',
      password: 'root'
    });
    return loginResponse.data.token;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function createUser(userData, token) {
  try {
    const response = await axios.post(`${API_URL}/api/users`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function testUserAndTenantCreation() {
  let token;
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    token = await loginAsAdmin();
    console.log('Logged in as admin');

    // Test 1: Create a tenant admin
    console.log('\nTest 1: Creating a tenant admin');
    const tenantAdminUsername = generateUniqueUsername('tenantadmin');
    const tenantAdmin = await createUser({
      username: tenantAdminUsername,
      email: `${tenantAdminUsername}@example.com`,
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Tenant',
      lastName: 'Admin One',
      role: 'tenantadmin'
    }, token);
    console.log('Tenant Admin created:', tenantAdmin ? 'Success' : 'Failed');

    if (tenantAdmin) {
      // Test 2: Create regular users under the tenant admin
      console.log('\nTest 2: Creating regular users under the tenant admin');
      
      // Login as the tenant admin
      const tenantAdminLoginResponse = await axios.post(`${API_URL}/api/auth/login`, {
        username: tenantAdminUsername,
        password: 'password123'
      });
      const tenantAdminToken = tenantAdminLoginResponse.data.token;

      const user1Username = generateUniqueUsername('user1');
      const user1 = await createUser({
        username: user1Username,
        email: `${user1Username}@example.com`,
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'User',
        lastName: 'One',
        role: 'user'
      }, tenantAdminToken);
      console.log('User 1 created:', user1 ? 'Success' : 'Failed');

      const user2Username = generateUniqueUsername('user2');
      const user2 = await createUser({
        username: user2Username,
        email: `${user2Username}@example.com`,
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'User',
        lastName: 'Two',
        role: 'user'
      }, tenantAdminToken);
      console.log('User 2 created:', user2 ? 'Success' : 'Failed');

      // Test 3: Attempt to create a user with a duplicate email address
      console.log('\nTest 3: Attempting to create a user with a duplicate email address');
      const duplicateUser = await createUser({
        username: generateUniqueUsername('duplicateuser'),
        email: `${user1Username}@example.com`,
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Duplicate',
        lastName: 'User',
        role: 'user'
      }, tenantAdminToken);
      console.log('Duplicate user creation:', duplicateUser ? 'Unexpectedly Succeeded' : 'Failed as expected');
    }

    // Verify tenant and user creation
    const tenants = await Tenant.find();
    console.log('\nTotal tenants created:', tenants.length);
    for (const tenant of tenants) {
      console.log(`Tenant: ${tenant.name}, Users: ${tenant.userCount}`);
      const usersInTenant = await User.find({ tenantId: tenant._id });
      console.log('Users in this tenant:');
      usersInTenant.forEach(user => {
        console.log(`- ${user.username} (${user.email}), Role: ${user.role}`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

testUserAndTenantCreation();
