const mongoose = require('mongoose');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
require('dotenv').config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Inventory.deleteMany({});

    // Seed users
    const users = [
      {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
      },
      // Add more users as needed
    ];

    const createdUsers = [];
    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
      createdUsers.push(newUser);
    }

    // Seed inventory items
    const inventoryItems = [
      {
        name: 'Laptop',
        description: 'Dell XPS 13',
        quantity: 10,
        category: 'Electronics',
        createdBy: createdUsers[0]._id, // Use the first created user as the creator
      },
      {
        name: 'Monitor',
        description: 'LG 27-inch 4K',
        quantity: 20,
        category: 'Electronics',
        createdBy: createdUsers[0]._id,
      },
      // Add more inventory items as needed
    ];

    for (const item of inventoryItems) {
      const newItem = new Inventory(item);
      await newItem.save();
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
