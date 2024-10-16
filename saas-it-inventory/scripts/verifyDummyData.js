const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Asset = require('../models/Asset');
const Subscription = require('../models/Subscription');
const Inventory = require('../models/Inventory');

dotenv.config();

async function verifyDummyData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Verify Tenants
    const tenants = await Tenant.find();
    console.log('Tenants:', tenants.map(t => ({ name: t.name, subscriptionPlan: t.subscriptionPlan })));

    // Verify Users
    const users = await User.find();
    console.log('Users:', users.map(u => ({ username: u.username, role: u.role, tenantId: u.tenantId })));

    // Verify Assets
    const assets = await Asset.find();
    console.log('Assets:', assets.map(a => ({ name: a.name, type: a.type, status: a.status })));

    // Verify Inventory
    const inventoryItems = await Inventory.find();
    console.log('Inventory Items:', inventoryItems.map(i => ({ name: i.name, quantity: i.quantity, category: i.category })));

    // Verify Subscriptions
    const subscriptions = await Subscription.find();
    console.log('Subscriptions:', subscriptions.map(s => ({ name: s.name, provider: s.provider, status: s.status })));

    console.log('Data verification complete');
  } catch (error) {
    console.error('Error verifying dummy data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyDummyData();
