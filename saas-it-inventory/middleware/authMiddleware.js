const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  logger.info('Auth middleware called');
  logger.info('Request URL:', req.originalUrl);
  logger.info('Headers:', req.headers);

  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    logger.info('Token:', token);

    if (!token) {
      logger.warn('No token provided');
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info('Decoded token:', decoded);

    const user = await User.findById(decoded.userId); // Use findById for better error handling
    logger.info('User found:', user);

    if (!user) {
      logger.warn('User not found');
      throw new Error('User not found');
    }

    //Skip tenant check for user creation
    if (req.originalUrl !== '/api/users') {
        // Check if the user belongs to the specified tenant (except for superadmin and admin)
        // Only perform this check if decoded.tenantId exists
        if (!['superadmin', 'admin'].includes(user.role) && decoded.tenantId && user.tenantId && user.tenantId.toString() !== decoded.tenantId) {
          logger.warn('User does not belong to the specified tenant');
          throw new Error('User does not belong to the specified tenant');
        }
    }

    req.token = token;
    req.user = {
      userId: user._id,
      username: user.username,
      role: user.role,
      tenantId: user.tenantId,
    };
    logger.info('User set in request:', req.user);
    logger.info('req.user after middleware:', req.user); 
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

const isSuperAdmin = (req, res, next) => {
  logger.info('isSuperAdmin middleware called');
  logger.info('User:', req.user);
  if (req.user && (req.user.role === 'superadmin' || req.user.role === 'admin')) {
    logger.info('User is a superadmin or admin');
    next();
  } else {
    logger.warn('Access denied: Not a superadmin or admin');
    res.status(403).json({ error: 'Access denied. Super Admin or Admin role required.' });
  }
};

const isTenantAdmin = (req, res, next) => {
  logger.info('isTenantAdmin middleware called');
  logger.info('User:', req.user);
  if (req.user && (req.user.role === 'tenantadmin' || req.user.role === 'admin' || req.user.role === 'superadmin')) {
    logger.info('User is a tenant admin, admin, or superadmin');
    next();
  } else {
    logger.warn('Access denied: Not a tenant admin, admin, or superadmin');
    res.status(403).json({ error: 'Access denied. Tenant Admin, Admin, or Super Admin role required.' });
  }
};

const isTenantAdminOrSuperAdmin = (req, res, next) => {
  logger.info('isTenantAdminOrSuperAdmin middleware called');
  logger.info('User:', req.user);
  if (req.user && ['superadmin', 'admin', 'tenantadmin'].includes(req.user.role)) {
    logger.info('User is a superadmin, admin, or tenant admin');
    next();
  } else {
    logger.warn('Access denied: Not a superadmin, admin, or tenant admin');
    res.status(403).json({ error: 'Access denied. Tenant Admin, Admin, or Super Admin role required.' });
  }
};

const belongsToTenant = (req, res, next) => {
  logger.info('belongsToTenant middleware called');
  logger.info('User:', req.user);
  logger.info('Requested tenant ID:', req.params.id);
  if (req.user && (['superadmin', 'admin'].includes(req.user.role) || (req.user.tenantId && req.user.tenantId.toString() === req.params.id))) {
    logger.info('User belongs to the requested tenant, is an admin, or is a superadmin');
    next();
  } else {
    logger.warn('Access denied: User does not belong to the requested tenant');
    res.status(403).json({ error: 'Access denied. You do not belong to this tenant.' });
  }
};

module.exports = {
  authMiddleware,
  isSuperAdmin,
  isTenantAdmin,
  isTenantAdminOrSuperAdmin,
  belongsToTenant
};
