const Tenant = require('../models/Tenant');
const User = require('../models/User');
const mongoose = require('mongoose');

const tenantService = {
  getOrCreateTenantForUser: async (userData, currentUser) => {
    let tenantId;

    if (userData.role === 'superadmin') {
      return null;
    }

    try {
      if (userData.role === 'tenantadmin' && !userData.tenantId) {
        const newTenant = new Tenant({
          name: `${userData.firstName} ${userData.lastName}'s Tenant`,
          smtpSettings: { secure: false },
          subscriptionStatus: 'trial',
          subscriptionPlan: 'basic',
          userCount: 1,
          assetCount: 0,
          userLimit: 5,
          assetLimit: 100
        });
        const savedTenant = await newTenant.save();
        tenantId = savedTenant._id;
        console.log('New tenant created:', savedTenant);
      } else if (userData.tenantId) {
        const tenant = await Tenant.findById(userData.tenantId);
        if (!tenant) {
          throw new Error(`Tenant not found for ID: ${userData.tenantId}`);
        }
        tenantId = userData.tenantId;
        console.log('Using existing tenant:', tenant);
      } else if (currentUser && currentUser.tenantId) {
        tenantId = currentUser.tenantId;
        console.log('Using current user\'s tenant:', tenantId);
      } else {
        throw new Error('Unable to determine tenant for user');
      }

      return tenantId;
    } catch (error) {
      console.error('Error in getOrCreateTenantForUser:', error);
      throw error;
    }
  },

  validateTenantPermission: (currentUser, targetTenantId) => {
    console.log('Validating tenant permission:');
    console.log('currentUser:', JSON.stringify(currentUser));
    console.log('targetTenantId:', targetTenantId);

    if (!currentUser || !currentUser.role) {
      console.log('Invalid currentUser object');
      return false;
    }

    if (currentUser.role === 'superadmin' || currentUser.role === 'admin') {
      console.log('User is superadmin or admin, permission granted');
      return true;
    }

    if (currentUser.role === 'tenantadmin' && currentUser.tenantId && targetTenantId) {
      console.log('User is tenantadmin, comparing tenantIds');
      console.log('currentUser.tenantId:', currentUser.tenantId);
      console.log('targetTenantId:', targetTenantId);
      const hasPermission = currentUser.tenantId === targetTenantId;
      console.log('Has permission:', hasPermission);
      return hasPermission;
    }

    console.log('Permission denied');
    return false;
  },

  updateTenantUserCount: async (tenantId, increment) => {
    if (!tenantId) {
      console.log('No tenantId provided for updateTenantUserCount');
      return;
    }

    try {
      const tenant = await Tenant.findById(tenantId);
      if (tenant) {
        tenant.userCount = Math.max((tenant.userCount || 0) + increment, 0);
        await tenant.save();
        console.log('Updated tenant user count:', tenant);
      } else {
        console.log('Tenant not found for ID:', tenantId);
      }
    } catch (error) {
      console.error('Error updating tenant user count:', error);
    }
  },

  getAllTenants: async () => {
    return Tenant.find();
  },

  getTenantById: async (tenantId) => {
    return Tenant.findById(tenantId);
  },

  checkTenantExists: async (tenantId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(tenantId)) {
        console.log('Invalid tenant ID format:', tenantId);
        return false;
      }
      const tenant = await Tenant.findById(tenantId);
      if (tenant) {
        console.log('Tenant found:', tenant);
        return true;
      } else {
        console.log('Tenant not found for ID:', tenantId);
        return false;
      }
    } catch (error) {
      console.error('Error checking tenant existence:', error);
      return false;
    }
  },

  removeSubdomainIndex: async () => {
    try {
      await Tenant.collection.dropIndex('subdomain_1');
      console.log('Subdomain index removed successfully');
    } catch (error) {
      if (error.code === 27) {
        console.log('Subdomain index does not exist');
      } else {
        console.error('Error removing subdomain index:', error);
      }
    }
  }
};

module.exports = tenantService;
