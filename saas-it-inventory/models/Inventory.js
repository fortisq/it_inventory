const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  serialNumber: { type: String },
  warrantyStartDate: { type: Date },
  warrantyEndDate: { type: Date },
  cost: { type: Number },
  price: { type: Number },
  reorderPoint: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
