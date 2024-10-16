const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Asset = require('../models/Asset');
const Subscription = require('../models/Subscription');
const Inventory = require('../models/Inventory');

dotenv.config();

async function initializeDummyData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Remove existing tenants
    await Tenant.deleteMany({});
    console.log('Existing tenants removed');

    // Create tenants
    const tenant1 = await Tenant.create({
      name: 'Tenant 1',
      subscriptionStatus: 'active',
      subscriptionPlan: 'basic',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userCount: 0,
      assetCount: 0,
    });

    const tenant2 = await Tenant.create({
      name: 'Tenant 2',
      subscriptionStatus: 'active',
      subscriptionPlan: 'pro',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userCount: 0,
      assetCount: 0,
    });

    console.log('Tenants created');

    // Create users
    const password = await bcrypt.hash('password123', 10);
    const userDataList = [
      { username: 'admin1', email: 'admin1@example.com', password, role: 'tenantadmin', firstName: 'Admin', lastName: 'One', tenantId: tenant1._id },
      { username: 'user1', email: 'user1@example.com', password, role: 'user', firstName: 'User', lastName: 'One', tenantId: tenant1._id },
      { username: 'admin2', email: 'admin2@example.com', password, role: 'tenantadmin', firstName: 'Admin', lastName: 'Two', tenantId: tenant2._id },
      { username: 'user2', email: 'user2@example.com', password, role: 'user', firstName: 'User', lastName: 'Two', tenantId: tenant2._id },
    ];

    const users = await Promise.all(userDataList.map(userData =>
      User.findOneAndUpdate(
        { username: userData.username },
        userData,
        { upsert: true, new: true }
      )
    ));

    console.log('Users created or updated');

    // Remove existing assets
    await Asset.deleteMany({});
    console.log('Existing assets removed');

    // Create assets
    const assetDataList = [
      { 
        name: 'Laptop 1', 
        type: 'Hardware', 
        status: 'In Use', 
        purchaseDate: new Date('2023-01-01'), 
        purchasePrice: 1000, 
        createdBy: users[0]._id,
        updatedBy: users[0]._id,
        maintenanceFrequency: 'annually',
        nextMaintenanceDate: new Date('2024-01-01'),
        serialNumber: 'LT001'
      },
      { 
        name: 'Software License 1', 
        type: 'Software', 
        status: 'Active', 
        purchaseDate: new Date('2023-02-01'), 
        purchasePrice: 500, 
        createdBy: users[0]._id,
        updatedBy: users[0]._id,
        maintenanceFrequency: 'monthly',
        nextMaintenanceDate: new Date('2023-03-01'),
        serialNumber: 'SL001'
      },
      { 
        name: 'Laptop 2', 
        type: 'Hardware', 
        status: 'In Use', 
        purchaseDate: new Date('2023-03-01'), 
        purchasePrice: 1200, 
        createdBy: users[2]._id,
        updatedBy: users[2]._id,
        maintenanceFrequency: 'annually',
        nextMaintenanceDate: new Date('2024-03-01'),
        serialNumber: 'LT002'
      },
      { 
        name: 'Software License 2', 
        type: 'Software', 
        status: 'Active', 
        purchaseDate: new Date('2023-04-01'), 
        purchasePrice: 600, 
        createdBy: users[2]._id,
        updatedBy: users[2]._id,
        maintenanceFrequency: 'monthly',
        nextMaintenanceDate: new Date('2023-05-01'),
        serialNumber: 'SL002'
      },
    ];

    await Asset.create(assetDataList);

    console.log('Assets created');

    // Remove existing inventory items
    await Inventory.deleteMany({});
    console.log('Existing inventory items removed');

    // Create inventory items
    const inventoryDataList = [
      {
        name: 'Laptop Charger',
        description: 'Universal laptop charger',
        quantity: 50,
        category: 'Accessories',
        serialNumber: 'CHG001',
        warrantyStartDate: new Date('2023-01-01'),
        warrantyEndDate: new Date('2024-01-01'),
        cost: 20,
        price: 30,
        reorderPoint: 10,
        createdBy: users[0]._id,
        updatedBy: users[0]._id
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        quantity: 100,
        category: 'Accessories',
        serialNumber: 'MOU001',
        warrantyStartDate: new Date('2023-02-01'),
        warrantyEndDate: new Date('2024-02-01'),
        cost: 15,
        price: 25,
        reorderPoint: 20,
        createdBy: users[0]._id,
        updatedBy: users[0]._id
      },
      {
        name: 'Office Chair',
        description: 'Adjustable office chair',
        quantity: 30,
        category: 'Furniture',
        serialNumber: 'CHR001',
        warrantyStartDate: new Date('2023-03-01'),
        warrantyEndDate: new Date('2026-03-01'),
        cost: 100,
        price: 150,
        reorderPoint: 5,
        createdBy: users[2]._id,
        updatedBy: users[2]._id
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp',
        quantity: 75,
        category: 'Accessories',
        serialNumber: 'LMP001',
        warrantyStartDate: new Date('2023-04-01'),
        warrantyEndDate: new Date('2024-04-01'),
        cost: 25,
        price: 40,
        reorderPoint: 15,
        createdBy: users[2]._id,
        updatedBy: users[2]._id
      }
    ];

    await Inventory.create(inventoryDataList);

    console.log('Inventory items created');

    // Create subscriptions
    const subscriptionDataList = [
      { 
        name: 'Cloud Service 1', 
        provider: 'AWS', 
        licenseType: 'SaaS',
        startDate: new Date('2023-01-01'), 
        endDate: new Date('2024-01-01'), 
        cost: 1000, 
        numberOfLicenses: 10,
        status: 'active',
        createdBy: users[0]._id,
        updatedBy: users[0]._id
      },
      { 
        name: 'SaaS Tool 1', 
        provider: 'Microsoft', 
        licenseType: 'SaaS',
        startDate: new Date('2023-02-01'), 
        endDate: new Date('2024-02-01'), 
        cost: 500, 
        numberOfLicenses: 5,
        status: 'active',
        createdBy: users[0]._id,
        updatedBy: users[0]._id
      },
      { 
        name: 'Cloud Service 2', 
        provider: 'Google Cloud', 
        licenseType: 'PaaS',
        startDate: new Date('2023-03-01'), 
        endDate: new Date('2024-03-01'), 
        cost: 1200, 
        numberOfLicenses: 15,
        status: 'active',
        createdBy: users[2]._id,
        updatedBy: users[2]._id
      },
      { 
        name: 'SaaS Tool 2', 
        provider: 'Salesforce', 
        licenseType: 'SaaS',
        startDate: new Date('2023-04-01'), 
        endDate: new Date('2024-04-01'), 
        cost: 600, 
        numberOfLicenses: 8,
        status: 'active',
        createdBy: users[2]._id,
        updatedBy: users[2]._id
      },
    ];

    await Promise.all(subscriptionDataList.map(subscriptionData =>
      Subscription.findOneAndUpdate(
        { name: subscriptionData.name, provider: subscriptionData.provider },
        subscriptionData,
        { upsert: true, new: true }
      )
    ));

    console.log('Subscriptions created or updated');

    console.log('Dummy data initialized successfully');
  } catch (error) {
    console.error('Error initializing dummy data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initializeDummyData();
