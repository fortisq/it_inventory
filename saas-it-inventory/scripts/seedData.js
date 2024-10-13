const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Asset = require('../models/Asset');
const SoftwareSubscription = require('../models/SoftwareSubscription');
const Inventory = require('../models/Inventory');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    // Clear existing data
    await User.deleteMany({});
    await Asset.deleteMany({});
    await SoftwareSubscription.deleteMany({});
    await Inventory.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });

    // Create some sample assets
    await Asset.insertMany([
      { name: 'Laptop 1', type: 'Hardware', status: 'Active', assignedTo: 'John Doe' },
      { name: 'Desktop 1', type: 'Hardware', status: 'Active', assignedTo: 'Jane Smith' },
      { name: 'Server 1', type: 'Hardware', status: 'Maintenance', assignedTo: 'IT Department' }
    ]);

    // Create some sample software subscriptions
    await SoftwareSubscription.insertMany([
      { name: 'Office 365', vendor: 'Microsoft', licenseType: 'Per User', expirationDate: new Date('2024-12-31'), seats: 100 },
      { name: 'Adobe Creative Cloud', vendor: 'Adobe', licenseType: 'Per Device', expirationDate: new Date('2024-06-30'), seats: 50 }
    ]);

    // Create some sample inventory items
    await Inventory.insertMany([
      { name: 'Keyboard', quantity: 20, category: 'Peripherals' },
      { name: 'Mouse', quantity: 15, category: 'Peripherals' },
      { name: 'Monitor', quantity: 5, category: 'Displays' }
    ]);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
