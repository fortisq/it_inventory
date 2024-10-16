const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function setRootPassword() {
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.updateOne({ username: 'root' }, { $set: { password: hashedPassword } });

    console.log('Root user password set successfully');
    console.log('Hashed password:', hashedPassword);
  } catch (error) {
    console.error('Error setting root user password:', error);
  } finally {
    await mongoose.disconnect();
  }
}

setRootPassword();
