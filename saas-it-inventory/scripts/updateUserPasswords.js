const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function updatePasswords() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      console.log(`Updating password for user: ${user.username}`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('root', salt); // Default password set to 'root'
      
      // Update only the password field
      await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
      
      console.log(`Updated password for user: ${user.username}`);
    }

    console.log('All user passwords have been updated');
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

updatePasswords();
