const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function createRootUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const rootUser = await User.findOne({ username: 'root' });
    if (rootUser) {
      console.log('Root user already exists');
      return;
    }

    const newRootUser = new User({
      username: 'root',
      email: 'root@example.com',
      password: 'root',
      firstName: 'Root',
      lastName: 'User',
      role: 'admin'
    });

    await newRootUser.save();
    console.log('Root user created successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

console.log('Script started');
createRootUser().then(() => console.log('Script finished'));
