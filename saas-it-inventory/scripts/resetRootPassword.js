const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function resetRootPassword() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const rootUser = await User.findOne({ username: 'root' });
    if (!rootUser) {
      console.log('Root user not found in the database');
      return;
    }

    console.log('Root user found. Current password hash:', rootUser.password);

    const newPassword = 'root';
    
    rootUser.password = newPassword; // Set plain text password
    const savedUser = await rootUser.save();

    console.log('User after save. Password hash:', savedUser.password);

    // Verify the save was successful
    const verifyUser = await User.findOne({ username: 'root' });
    console.log('Verified user password hash:', verifyUser.password);

    // Test the password
    const isPasswordCorrect = await verifyUser.comparePassword(newPassword);
    console.log('Is new password correct?', isPasswordCorrect);

    if (isPasswordCorrect) {
      console.log('Root user password has been successfully reset to "root"');
    } else {
      console.log('Warning: Password update may have failed. Password comparison failed.');
    }

  } catch (error) {
    console.error('Error:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

console.log('Script started');
resetRootPassword().then(() => console.log('Script finished'));
