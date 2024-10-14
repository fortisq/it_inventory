const mongoose = require('mongoose');
const User = require('../models/User');

async function checkRootUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/it_inventory', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const rootUser = await User.findOne({ username: 'root' });
    if (rootUser) {
      console.log('Root user exists:', rootUser);
    } else {
      console.log('Root user does not exist');
    }
  } catch (error) {
    console.error('Error checking root user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkRootUser();
