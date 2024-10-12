/**
 * SaaS IT Inventory Application - User Model
 * 
 * Copyright (c) 2024 Dan Bressers, NIT Solutions Ltd
 * 
 * This file is part of the SaaS IT Inventory Application.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
