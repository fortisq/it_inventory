const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

logger.info('Starting Asset model definition');

const statusEnum = ['available', 'in_use', 'maintenance', 'retired'];

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  purchaseDate: { type: Date },
  purchasePrice: { type: Number },
  currentValue: { type: Number },
  location: { type: String },
  assignedTo: { type: String },
  status: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return statusEnum.includes(v);
      },
      message: props => `${props.value} is not a valid status`
    }
  },
  maintenanceSchedule: { type: String },
  lastMaintenanceDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

assetSchema.pre('validate', function(next) {
  logger.info('Pre-validate hook triggered');
  logger.info('Asset data:', JSON.stringify(this.toObject(), null, 2));
  next();
});

assetSchema.pre('save', function(next) {
  logger.info('Pre-save hook triggered');
  logger.info('Asset data:', JSON.stringify(this.toObject(), null, 2));
  next();
});

const Asset = mongoose.model('Asset', assetSchema);

logger.info('Asset model created');

module.exports = Asset;
