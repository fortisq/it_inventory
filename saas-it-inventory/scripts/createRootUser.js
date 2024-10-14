const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createRootUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/it_inventory', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingUser = await User.findOne({ username: 'root' });
    if (existingUser) {
      console.log('Root user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('root', 10);
    const rootUser = new User({
      username: 'root',
      password: hashedPassword,
      email: 'root@example.com',
      role: 'admin',
    });

    await rootUser.save();
    console.log('Root user created successfully');
  } catch (error) {
    console.error('Error creating root user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createRootUser();
