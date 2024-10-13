const { createSuperAdmin } = require('../utils/createSuperAdmin');
const mongoose = require('mongoose');

async function init() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await createSuperAdmin();
    console.log('Super admin created or updated');

    process.exit(0);
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
}

init();
