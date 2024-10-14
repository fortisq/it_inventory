const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  serialNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // This allows null values while maintaining uniqueness for non-null values
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number
  },
  currentValue: {
    type: Number
  },
  location: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    trim: true
  },
  maintenanceFrequency: {
    type: String,
    enum: ['weekly', 'monthly', 'quarterly', 'annually', 'custom'],
    required: true
  },
  nextMaintenanceDate: {
    type: Date,
    required: true
  },
  lastMaintenanceDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

assetSchema.methods.calculateNextMaintenanceDate = function() {
  if (!this.lastMaintenanceDate) {
    return new Date(); // If no last maintenance date, set next maintenance to today
  }

  const lastDate = new Date(this.lastMaintenanceDate);
  let nextDate = new Date(lastDate);

  switch (this.maintenanceFrequency) {
    case 'weekly':
      nextDate.setDate(lastDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(lastDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(lastDate.getMonth() + 3);
      break;
    case 'annually':
      nextDate.setFullYear(lastDate.getFullYear() + 1);
      break;
    case 'custom':
      // For custom frequency, we'll keep the next maintenance date as set by the user
      return this.nextMaintenanceDate;
    default:
      return new Date(); // Default to today if frequency is not recognized
  }

  return nextDate;
};

assetSchema.pre('save', function(next) {
  if (this.isModified('lastMaintenanceDate') || this.isModified('maintenanceFrequency')) {
    this.nextMaintenanceDate = this.calculateNextMaintenanceDate();
  }
  next();
});

assetSchema.plugin(mongoosePaginate);

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
