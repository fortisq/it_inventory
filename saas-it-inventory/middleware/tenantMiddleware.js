const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => {
  // Bypass tenant check for login and register routes
  if (req.path === '/api/auth/login' || req.path === '/api/auth/register') {
    return next();
  }

  const tenantId = req.headers['x-tenant-id'];

  if (!tenantId) {
    return res.status(400).json({ message: 'Tenant ID is required' });
  }

  try {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error processing tenant', error: error.message });
  }
};

module.exports = tenantMiddleware;
