const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Subscription change notification
const sendSubscriptionChangeNotification = async (to, planName) => {
  const subject = 'Subscription Plan Changed';
  const text = `Your subscription plan has been changed to ${planName}.`;
  const html = `<p>Your subscription plan has been changed to <strong>${planName}</strong>.</p>`;
  return sendEmail(to, subject, text, html);
};

// Approaching usage limit notification
const sendApproachingLimitNotification = async (to, resourceType, currentUsage, limit) => {
  const subject = `Approaching ${resourceType} Limit`;
  const text = `You are approaching your ${resourceType} limit. Current usage: ${currentUsage}/${limit}.`;
  const html = `<p>You are approaching your ${resourceType} limit. Current usage: <strong>${currentUsage}/${limit}</strong>.</p>`;
  return sendEmail(to, subject, text, html);
};

// Upcoming renewal notification
const sendUpcomingRenewalNotification = async (to, planName, renewalDate) => {
  const subject = 'Upcoming Subscription Renewal';
  const text = `Your ${planName} subscription will renew on ${renewalDate}.`;
  const html = `<p>Your <strong>${planName}</strong> subscription will renew on <strong>${renewalDate}</strong>.</p>`;
  return sendEmail(to, subject, text, html);
};

// Warranty expiration notification
const sendWarrantyExpirationNotification = async (to, assetName, expiryDate) => {
  const subject = 'Asset Warranty Expiration';
  const text = `The warranty for your asset "${assetName}" will expire on ${expiryDate}.`;
  const html = `<p>The warranty for your asset "<strong>${assetName}</strong>" will expire on <strong>${expiryDate}</strong>.</p>`;
  return sendEmail(to, subject, text, html);
};

// Software subscription expiration notification
const sendSubscriptionExpirationNotification = async (to, subscriptionName, expiryDate) => {
  const subject = 'Software Subscription Expiration';
  const text = `Your software subscription "${subscriptionName}" will expire on ${expiryDate}.`;
  const html = `<p>Your software subscription "<strong>${subscriptionName}</strong>" will expire on <strong>${expiryDate}</strong>.</p>`;
  return sendEmail(to, subject, text, html);
};

module.exports = {
  sendSubscriptionChangeNotification,
  sendApproachingLimitNotification,
  sendUpcomingRenewalNotification,
  sendWarrantyExpirationNotification,
  sendSubscriptionExpirationNotification,
};
