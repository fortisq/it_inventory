const mongoose = require('mongoose');
const User = require('../models/User');

async function createTestUser() {
  const uri = 'mongodb://localhost:27017/it_inventory';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    const testUser = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
      role: 'admin'
    });

    await testUser.save();
    console.log('Test user created successfully:', testUser._id);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser().catch(console.error);
