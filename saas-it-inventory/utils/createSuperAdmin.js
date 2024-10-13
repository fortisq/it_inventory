const User = require('../models/User');
const crypto = require('crypto');

const createSuperAdmin = async () => {
  try {
    const superAdminEmail = 'admin@example.com';
    const superAdminPassword = 'root';
    const superAdminUsername = 'root';

    console.log('Checking for existing super admin...');
    let superAdmin = await User.findOne({ username: superAdminUsername });

    if (superAdmin) {
      console.log('Existing super admin found. Updating password...');
    } else {
      console.log('Creating new super admin...');
      superAdmin = new User({
        username: superAdminUsername,
        email: superAdminEmail,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'superadmin'
      });
    }

    // Simple hashing for debugging
    const hashedPassword = crypto.createHash('sha256').update(superAdminPassword).digest('hex');
    console.log('Hashed password before save:', hashedPassword);
    superAdmin.password = superAdminPassword; // Set plain password, let the model hash it
    await superAdmin.save();

    console.log('Super admin created/updated successfully');

    // Double-check by fetching the user again
    const checkUser = await User.findOne({ username: superAdminUsername });
    console.log('Stored hashed password:', checkUser.password);
    console.log('Passwords match:', hashedPassword === checkUser.password);

    // Test password comparison
    const isMatch = await checkUser.comparePassword(superAdminPassword);
    console.log('Password comparison result:', isMatch);

  } catch (error) {
    console.error('Error creating/updating super admin:', error);
  }
};

module.exports = { createSuperAdmin };
