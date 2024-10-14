const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function updateRootPassword() {
  try {
    await mongoose.connect('mongodb://localhost:27017/it_inventory', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const rootUser = await User.findOne({ username: 'root' });
    if (!rootUser) {
      console.log('Root user not found');
      return;
    }

    const newPassword = 'root';
    rootUser.password = newPassword; // The pre-save hook will hash this
    await rootUser.save();

    console.log('Root user password updated successfully');
    console.log('New hashed password:', rootUser.password);
  } catch (error) {
    console.error('Error updating root user password:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateRootPassword();
