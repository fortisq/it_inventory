const User = require('../models/User');
const tenantService = require('../services/tenantService');
const mongoose = require('mongoose');

const userController = {
  getUsers: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
      }

      let users;
      if (req.user.role === 'superadmin' || req.user.role === 'admin') {
        users = await User.find().select('-password');
      } else if (req.user.role === 'tenantadmin') {
        users = await User.find({ tenantId: req.user.tenantId }).select('-password');
      } else {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
      res.json(users);
    } catch (error) {
      console.error('Error in getUsers:', error);
      res.status(500).json({ message: error.message });
    }
  },

  addUser: async (req, res) => {
    console.log('addUser function called');
    try {
      console.log('Received user data:', req.body);
      console.log('Current user:', req.user);

      const { password, confirmPassword, ...userData } = req.body;

      if (password !== confirmPassword) {
        console.log('Passwords do not match');
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      if (!req.user || !['superadmin', 'admin', 'tenantadmin'].includes(req.user.role)) {
        console.log('Insufficient permissions');
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      if (req.user.role !== 'superadmin' && (userData.role === 'superadmin' || userData.role === 'admin')) {
        console.log('Cannot create superadmin or admin');
        return res.status(403).json({ message: 'Forbidden: Cannot create superadmin or admin' });
      }

      try {
        let tenantId;
        if (userData.role === 'superadmin') {
          tenantId = null;
          console.log('Superadmin user, tenantId set to null');
        } else if (userData.role === 'tenantadmin' && !userData.tenantId) {
          tenantId = await tenantService.getOrCreateTenantForUser(userData, req.user);
          console.log('Created new tenant for tenant admin:', tenantId);
        } else {
          tenantId = req.user.tenantId;
          console.log('Using creator\'s tenantId:', tenantId);
        }
        console.log('Final tenantId:', tenantId);

        if (!tenantId && userData.role !== 'superadmin') {
          throw new Error('TenantId is required for non-superadmin users');
        }

        if (tenantId) {
          if (typeof tenantId === 'string') {
            tenantId = mongoose.Types.ObjectId(tenantId);
          }
          const tenantExists = await tenantService.checkTenantExists(tenantId);
          if (!tenantExists) {
            throw new Error('Invalid tenant ID');
          }
        }

        const newUserData = { ...userData, password, tenantId };

        console.log('Creating new user with data:', { ...newUserData, password: '[REDACTED]' });

        const newUser = new User(newUserData);
        await newUser.save();
        console.log('User saved successfully:', newUser);

        if (tenantId) {
          await tenantService.updateTenantUserCount(tenantId, 1);
        }

        const userResponse = newUser.toObject();
        delete userResponse.password;
        res.status(201).json(userResponse);
      } catch (error) {
        console.error('Error in tenant assignment or user creation:', error);
        if (error.code === 11000) {
          if (error.keyPattern.email) {
            return res.status(400).json({ message: 'A user with this email already exists' });
          } else if (error.keyPattern.username) {
            return res.status(400).json({ message: 'A user with this username already exists' });
          }
        }
        return res.status(400).json({ message: error.message });
      }
    } catch (error) {
      console.error('Error in addUser:', error);
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: 'Validation error', errors: validationErrors });
      }
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userToUpdate = await User.findById(req.params.id);
      
      if (!userToUpdate) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!tenantService.validateTenantPermission(req.user, userToUpdate.tenantId)) {
        return res.status(403).json({ message: 'Not authorized to update this user' });
      }

      if (req.user.role !== 'superadmin' && (req.body.role === 'superadmin' || req.body.role === 'admin')) {
        return res.status(403).json({ message: 'Cannot change role to superadmin or admin' });
      }

      if (req.user.role !== 'superadmin' && (userToUpdate.role === 'superadmin' || userToUpdate.role === 'admin')) {
        return res.status(403).json({ message: 'Cannot modify superadmin or admin role' });
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
      res.json(updatedUser);
    } catch (error) {
      console.error('Error in updateUser:', error);
      res.status(400).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      console.log('deleteUser function called');
      console.log('User ID to delete:', req.params.id);
      console.log('User making the request:', JSON.stringify(req.user));

      const userToDelete = await User.findById(req.params.id);
      
      if (!userToDelete) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('User to delete:', JSON.stringify(userToDelete));

      if (userToDelete.role === 'superadmin' || (userToDelete.role === 'admin' && req.user.role !== 'superadmin')) {
        console.log('Cannot delete superadmin or admin account');
        return res.status(403).json({ message: 'Cannot delete superadmin or admin account' });
      }

      if (userToDelete._id === req.user._id) {
        console.log('Cannot delete own account');
        return res.status(403).json({ message: 'Cannot delete your own account' });
      }

      console.log('userToDelete.tenantId:', userToDelete.tenantId);
      
      let hasPermission;
      try {
        if (req.user.role === 'superadmin' || req.user.role === 'admin') {
          hasPermission = true;
        } else {
          hasPermission = await tenantService.validateTenantPermission(req.user, userToDelete.tenantId);
        }
      } catch (error) {
        console.error('Error in validateTenantPermission:', error);
        return res.status(500).json({ message: 'Error validating tenant permission' });
      }
      console.log('Has permission to delete:', hasPermission);

      if (!hasPermission) {
        console.log('Not authorized to delete this user');
        return res.status(403).json({ message: 'Not authorized to delete this user' });
      }

      await User.findByIdAndDelete(req.params.id);
      console.log('User deleted from database');

      if (userToDelete.tenantId) {
        await tenantService.updateTenantUserCount(userToDelete.tenantId, -1);
        console.log('Tenant user count updated');
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;
