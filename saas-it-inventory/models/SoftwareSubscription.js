const mongoose = require('mongoose');

const softwareSubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vendor: { type: String, required: true },
  licenseKey: { type: String },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  seats: { type: Number, default: 1 },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  cost: { type: Number },
  renewalType: { type: String, enum: ['Monthly', 'Annually', 'One-time'], default: 'Annually' },
  status: { type: String, enum: ['Active', 'Expired', 'Cancelled'], default: 'Active' },
  notes: { type: String },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
}, { timestamps: true });

module.exports = mongoose.model('SoftwareSubscription', softwareSubscriptionSchema);
