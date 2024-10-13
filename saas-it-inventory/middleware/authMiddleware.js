/**
 * SaaS IT Inventory Application - Authentication Middleware
 * 
 * Copyright (c) 2024 Dan Bressers, NIT Solutions Ltd
 * 
 * This file is part of the SaaS IT Inventory Application.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new AuthError('No token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;

    if (decoded.role === 'superadmin') {
      user = await User.findOne({ _id: decoded.userId, role: 'superadmin' });
    } else {
      user = await User.findOne({ _id: decoded.userId, tenant: req.tenant?._id });
    }

    if (!user) {
      throw new AuthError('User not found', 401);
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error instanceof AuthError) {
      res.status(error.statusCode).send({ error: error.message });
    } else {
      res.status(401).send({ error: 'Please authenticate.' });
    }
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      throw new AuthError('Access denied. Admin privileges required.', 403);
    }
    next();
  } catch (error) {
    logger.error('Admin authorization error:', error);
    res.status(error.statusCode || 403).send({ error: error.message });
  }
};

const isTenantAdminOrSuperAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      throw new AuthError('Access denied. Tenant admin or super admin privileges required.', 403);
    }
    next();
  } catch (error) {
    logger.error('Tenant admin or super admin authorization error:', error);
    res.status(error.statusCode || 403).send({ error: error.message });
  }
};

const belongsToTenant = async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin' && req.user.tenant.toString() !== req.params.tenantId) {
      throw new AuthError('Access denied. User does not belong to this tenant.', 403);
    }
    next();
  } catch (error) {
    logger.error('Tenant authorization error:', error);
    res.status(error.statusCode || 403).send({ error: error.message });
  }
};

module.exports = {
  authMiddleware,
  isAdmin,
  isTenantAdminOrSuperAdmin,
  belongsToTenant
};
