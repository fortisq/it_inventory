const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '..', '.env');
console.log('Attempting to load .env file from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

console.log('MONGODB_URI:', process.env.MONGODB_URI);

const mongoose = require('mongoose');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const userController = require('../controllers/userController');
const tenantService = require('../services/tenantService');

// Mock request and response objects
const mockRequest = (params = {}, user = {}) => ({
  params,
  user
});

const mockResponse = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

async function testUserDeletion() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Create a new test tenant
    const testTenant = new Tenant({
      name: 'Test Tenant',
      smtpSettings: { secure: false },
      subscriptionStatus: 'trial',
      subscriptionPlan: 'basic',
      userCount: 1,
      assetCount: 0,
      userLimit: 5,
      assetLimit: 100
    });
    await testTenant.save();
    console.log('Test tenant created:', testTenant);

    // Create a new test user
    const testUser = new User({
      username: 'testuser_' + Date.now(),
      email: 'testuser_' + Date.now() + '@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      tenantId: testTenant._id
    });

    await testUser.save();
    console.log('Test user created:', testUser);

    // Create a mock admin user for deletion
    const adminUser = {
      _id: mongoose.Types.ObjectId(),
      role: 'admin',
      tenantId: testTenant._id
    };

    // Attempt to delete the test user
    const req = mockRequest({ id: testUser._id }, adminUser);
    const res = mockResponse();

    console.log('Calling deleteUser function');
    await userController.deleteUser(req, res);

    console.log('Response status:', res.statusCode);
    console.log('Response body:', res.body);

    if (res.statusCode === 200) {
      console.log('User deleted successfully');
    } else {
      console.error('Failed to delete user:', res.body);
    }

    // Verify if the user was actually deleted
    const deletedUser = await User.findById(testUser._id);
    if (deletedUser) {
      console.error('User still exists in the database after deletion attempt');
    } else {
      console.log('User successfully removed from the database');
    }

    // Check the tenant's user count
    const updatedTenant = await Tenant.findById(testTenant._id);
    console.log('Updated tenant:', updatedTenant);

  } catch (error) {
    console.error('Error in testUserDeletion:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

testUserDeletion();
