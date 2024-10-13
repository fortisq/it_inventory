const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant'
  }
}, {
  timestamps: true
});

userSchema.methods.comparePassword = function(candidatePassword) {
  const hashedPassword = crypto.createHash('sha256').update(candidatePassword).digest('hex');
  return this.password === hashedPassword;
};

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = crypto.createHash('sha256').update(this.password).digest('hex');
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
