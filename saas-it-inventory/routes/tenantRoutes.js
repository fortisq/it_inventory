const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const { authMiddleware, isAdmin, isTenantAdminOrSuperAdmin } = require('../middleware/authMiddleware');

// Create a new tenant
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const tenant = new Tenant(req.body);
    await tenant.save();
    res.status(201).json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all tenants
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (error) {
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
    res.status(500).json({ message: error.message });
  }
});

// Update a tenant
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a tenant
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update SMTP settings for a tenant
router.put('/:id/smtp', authMiddleware, isTenantAdminOrSuperAdmin, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    tenant.smtpSettings = req.body.smtpSettings;
    await tenant.save();

    res.json({ message: 'SMTP settings updated successfully', smtpSettings: tenant.smtpSettings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Stripe settings (admin only)
router.put('/:id/stripe', authMiddleware, isAdmin, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    tenant.stripeSettings = req.body.stripeSettings;
    await tenant.save();

    res.json({ message: 'Stripe settings updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
