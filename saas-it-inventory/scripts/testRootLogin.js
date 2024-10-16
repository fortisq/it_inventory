const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function testRootLogin() {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI);
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

    console.log('Root user found:');
    console.log('Username:', rootUser.username);
    console.log('Role:', rootUser.role);

    const testPassword = 'root';
    const isPasswordCorrect = await rootUser.comparePassword(testPassword);
    console.log(`Is password "${testPassword}" correct?`, isPasswordCorrect);

  } catch (error) {
    console.error('Error:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
  }
}

console.log('Script started');
testRootLogin().then(() => console.log('Script finished'));
