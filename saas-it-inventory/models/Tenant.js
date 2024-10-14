const mongoose = require('mongoose');
const crypto = require('crypto');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'trial', 'cancelled'], default: 'trial' },
  subscriptionPlan: { type: String, enum: ['basic', 'pro', 'enterprise'], default: 'basic' },
  nextBillingDate: { type: Date },
  userCount: { type: Number, default: 0 },
  assetCount: { type: Number, default: 0 },
  userLimit: { type: Number, default: 5 }, // Default limit for basic plan
  assetLimit: { type: Number, default: 100 }, // Default limit for basic plan
  stripeCustomerId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  smtpSettings: {
    host: { type: String },
    port: { type: Number, min: 1, max: 65535 },
    secure: { type: Boolean, default: false },
    auth: {
      user: { type: String },
      pass: { type: String, set: encryptField, get: decryptField }
    },
    from: { type: String, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  },
  stripeSettings: {
    publishableKey: { type: String },
    secretKey: { type: String, set: encryptField, get: decryptField },
    webhookSecret: { type: String, set: encryptField, get: decryptField }
  }
}, { strict: 'throw' }); // This option will throw an error if we try to save a field not in the schema

function encryptField(value) {
  if (!value) return;
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  return cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
}

function decryptField(value) {
  if (!value) return;
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  return decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
}

tenantSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  // Update limits based on the subscription plan
  switch (this.subscriptionPlan) {
    case 'basic':
      this.userLimit = 5;
      this.assetLimit = 100;
      break;
    case 'pro':
      this.userLimit = 20;
      this.assetLimit = 1000;
      break;
    case 'enterprise':
      this.userLimit = Infinity;
      this.assetLimit = Infinity;
      break;
  }

  next();
});

// Method to check if the tenant has reached its user limit
tenantSchema.methods.hasReachedUserLimit = function() {
  return this.userCount >= this.userLimit;
};

// Method to check if the tenant has reached its asset limit
tenantSchema.methods.hasReachedAssetLimit = function() {
  return this.assetCount >= this.assetLimit;
};

// Method to validate SMTP settings
tenantSchema.methods.validateSMTPSettings = async function() {
  const nodemailer = require('nodemailer');
  try {
    const transporter = nodemailer.createTransport(this.smtpSettings);
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('SMTP validation error:', error);
    return false;
  }
};

module.exports = mongoose.model('Tenant', tenantSchema);
