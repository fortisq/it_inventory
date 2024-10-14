const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateUserRoles = async () => {
  try {
    // Update all users without a role to 'user'
    await User.updateMany({ role: { $exists: false } }, { $set: { role: 'user' } });

    // Update the first user to 'superadmin' if no superadmin exists
    const superadminExists = await User.findOne({ role: 'superadmin' });
    if (!superadminExists) {
      const firstUser = await User.findOne().sort({ createdAt: 1 });
      if (firstUser) {
        firstUser.role = 'superadmin';
        await firstUser.save();
        console.log(`Updated user ${firstUser.username} to superadmin`);
      }
    }

    console.log('User roles updated successfully');
  } catch (error) {
    console.error('Error updating user roles:', error);
  } finally {
    mongoose.disconnect();
  }
};

updateUserRoles();
