const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Tenant = require('../models/Tenant');
const { authMiddleware, isAdmin, isTenantAdminOrSuperAdmin, belongsToTenant } = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

// Input validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Create a new tenant
router.post('/', 
  authMiddleware, 
  isAdmin, 
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('subdomain').notEmpty().withMessage('Subdomain is required')
  ]),
  async (req, res) => {
    try {
      const tenant = new Tenant(req.body);
      await tenant.save();
      res.status(201).json(tenant);
    } catch (error) {
      logger.error('Error creating tenant:', error);
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all tenants with pagination
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const totalTenants = await Tenant.countDocuments();
    const tenants = await Tenant.find().skip(startIndex).limit(limit);

    res.json({
      tenants,
      currentPage: page,
      totalPages: Math.ceil(totalTenants / limit),
      totalTenants
    });
  } catch (error) {
    logger.error('Error fetching tenants:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a specific tenant
router.get('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    logger.error('Error fetching tenant:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update a tenant
router.put('/:id', 
  authMiddleware, 
  isAdmin, 
  belongsToTenant,
  validate([
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('subdomain').optional().notEmpty().withMessage('Subdomain cannot be empty')
  ]),
  async (req, res) => {
    try {
      const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
      res.json(tenant);
    } catch (error) {
      logger.error('Error updating tenant:', error);
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a tenant
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    logger.error('Error deleting tenant:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update SMTP settings for a tenant
router.put('/:id/smtp', 
  authMiddleware, 
  isTenantAdminOrSuperAdmin, 
  belongsToTenant,
  validate([
    body('smtpSettings.host').notEmpty().withMessage('SMTP host is required'),
    body('smtpSettings.port').isInt({ min: 1, max: 65535 }).withMessage('Valid SMTP port is required'),
    body('smtpSettings.auth.user').notEmpty().withMessage('SMTP username is required'),
    body('smtpSettings.auth.pass').notEmpty().withMessage('SMTP password is required'),
    body('smtpSettings.from').isEmail().withMessage('Valid from email is required')
  ]),
  async (req, res) => {
    try {
      const tenant = await Tenant.findById(req.params.id);
      if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

      tenant.smtpSettings = req.body.smtpSettings;
      
      // Validate SMTP settings
      const isValid = await tenant.validateSMTPSettings();
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid SMTP settings' });
      }

      await tenant.save();
      res.json({ message: 'SMTP settings updated successfully', smtpSettings: tenant.smtpSettings });
    } catch (error) {
      logger.error('Error updating SMTP settings:', error);
      res.status(400).json({ message: error.message });
    }
  }
);

// Update Stripe settings (admin only)
router.put('/:id/stripe', 
  authMiddleware, 
  isAdmin,
  validate([
    body('stripeSettings.publishableKey').notEmpty().withMessage('Stripe publishable key is required'),
    body('stripeSettings.secretKey').notEmpty().withMessage('Stripe secret key is required'),
    body('stripeSettings.webhookSecret').notEmpty().withMessage('Stripe webhook secret is required')
  ]),
  async (req, res) => {
    try {
      const tenant = await Tenant.findById(req.params.id);
      if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

      tenant.stripeSettings = req.body.stripeSettings;
      await tenant.save();

      res.json({ message: 'Stripe settings updated successfully' });
    } catch (error) {
      logger.error('Error updating Stripe settings:', error);
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
