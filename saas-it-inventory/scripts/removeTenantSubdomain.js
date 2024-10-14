const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const Tenant = require('../models/Tenant');

async function removeTenantSubdomain() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');

    // Drop the subdomain index
    try {
      await Tenant.collection.dropIndex('subdomain_1');
      console.log('Subdomain index dropped successfully');
    } catch (error) {
      if (error.code === 27) {
        console.log('Subdomain index does not exist');
      } else {
        console.error('Error dropping subdomain index:', error);
      }
    }

    const tenants = await Tenant.find({});
    console.log(`Found ${tenants.length} tenants`);

    const result = await Tenant.updateMany(
      {},
      { $unset: { subdomain: "" } },
      { strict: false, multi: true }
    );

    console.log(`Subdomain removal completed. Updated ${result.nModified} tenants.`);

    // Verify removal
    const tenantsWithSubdomain = await Tenant.find({ subdomain: { $exists: true } });
    if (tenantsWithSubdomain.length > 0) {
      console.log(`Warning: ${tenantsWithSubdomain.length} tenants still have a subdomain field`);
      for (const tenant of tenantsWithSubdomain) {
        console.log(`Tenant with subdomain: ${tenant.name}`);
      }
    } else {
      console.log('All tenants have had their subdomain field removed successfully');
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

removeTenantSubdomain();
