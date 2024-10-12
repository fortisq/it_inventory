const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true },
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
    port: { type: Number },
    secure: { type: Boolean, default: false },
    auth: {
      user: { type: String },
      pass: { type: String }
    },
    from: { type: String }
  },
  stripeSettings: {
    publishableKey: { type: String },
    secretKey: { type: String },
    webhookSecret: { type: String }
  }
});

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

module.exports = mongoose.model('Tenant', tenantSchema);
