const cron = require('node-cron');
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const { sendUpcomingRenewalNotification } = require('./emailService');

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

// Schedule the task to run daily at midnight
const scheduleRenewalNotifications = () => {
  cron.schedule('0 0 * * *', () => {
    console.log('Running scheduled task: Send renewal notifications');
    sendRenewalNotifications();
  });
};

module.exports = {
  scheduleRenewalNotifications
};
