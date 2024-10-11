const cron = require('node-cron');
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const Asset = require('../models/Asset');
const SoftwareSubscription = require('../models/SoftwareSubscription');
const { sendUpcomingRenewalNotification, sendWarrantyExpirationNotification, sendSubscriptionExpirationNotification } = require('./emailService');

// Function to send renewal notifications
const sendRenewalNotifications = async () => {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const tenantsToNotify = await Tenant.find({
      nextBillingDate: {
        $gte: new Date(),
        $lte: threeDaysFromNow
      },
      subscriptionStatus: 'active'
    });

    for (const tenant of tenantsToNotify) {
      const adminUser = await User.findOne({ tenantId: tenant._id, role: 'admin' });
      if (adminUser) {
        await sendUpcomingRenewalNotification(
          adminUser.email,
          tenant.subscriptionPlan,
          tenant.nextBillingDate.toLocaleDateString()
        );
        console.log(`Sent renewal notification for tenant: ${tenant._id}`);
      }
    }
  } catch (error) {
    console.error('Error sending renewal notifications:', error);
  }
};

// Function to send warranty expiration notifications
const sendWarrantyExpirationNotifications = async () => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringAssets = await Asset.find({
      warrantyExpiryDate: {
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      }
    }).populate('tenantId');

    for (const asset of expiringAssets) {
      const adminUser = await User.findOne({ tenantId: asset.tenantId._id, role: 'admin' });
      if (adminUser) {
        await sendWarrantyExpirationNotification(
          adminUser.email,
          asset.name,
          asset.warrantyExpiryDate.toLocaleDateString()
        );
        console.log(`Sent warranty expiration notification for asset: ${asset._id}`);
      }
    }
  } catch (error) {
    console.error('Error sending warranty expiration notifications:', error);
  }
};

// Function to send software subscription expiration notifications
const sendSubscriptionExpirationNotifications = async () => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringSoftwareSubscriptions = await SoftwareSubscription.find({
      expiryDate: {
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      }
    }).populate('tenantId');

    for (const subscription of expiringSoftwareSubscriptions) {
      const adminUser = await User.findOne({ tenantId: subscription.tenantId._id, role: 'admin' });
      if (adminUser) {
        await sendSubscriptionExpirationNotification(
          adminUser.email,
          subscription.name,
          subscription.expiryDate.toLocaleDateString()
        );
        console.log(`Sent subscription expiration notification for subscription: ${subscription._id}`);
      }
    }
  } catch (error) {
    console.error('Error sending software subscription expiration notifications:', error);
  }
};

// Schedule the tasks to run daily at midnight
const scheduleAllTasks = () => {
  cron.schedule('0 0 * * *', () => {
    console.log('Running scheduled tasks');
    sendRenewalNotifications();
    sendWarrantyExpirationNotifications();
    sendSubscriptionExpirationNotifications();
  });
};

module.exports = {
  scheduleAllTasks
};
