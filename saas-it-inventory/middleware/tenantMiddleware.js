const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => {
  try {
    // Extract subdomain from the host
    const subdomain = req.hostname.split('.')[0];

    // Find the tenant based on the subdomain
    const tenant = await Tenant.findOne({ subdomain });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (!tenant.isActive) {
      return res.status(403).json({ message: 'Tenant is inactive' });
    }

    // Attach the tenant to the request object
    req.tenant = tenant;

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = tenantMiddleware;
