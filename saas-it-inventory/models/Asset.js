const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  serialNumber: { type: String, unique: true },
  purchaseDate: { type: Date },
  warrantyExpiryDate: { type: Date },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['In Use', 'In Storage', 'Under Repair', 'Retired'], default: 'In Storage' },
  location: { type: String },
  notes: { type: String },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
