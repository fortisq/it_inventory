const express = require('express');
const License = require('../models/License');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all license routes
router.use(authMiddleware);

// Create a new license
router.post('/', async (req, res) => {
  try {
    const license = new License({
      ...req.body,
      tenant: req.tenant._id
    });
    await license.save();
    res.status(201).json(license);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all licenses for the tenant
router.get('/', async (req, res) => {
  try {
    const licenses = await License.find({ tenant: req.tenant._id });
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific license
router.get('/:id', async (req, res) => {
  try {
    const license = await License.findOne({ _id: req.params.id, tenant: req.tenant._id });
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }
    res.json(license);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a license
router.patch('/:id', async (req, res) => {
  try {
    const license = await License.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }
    res.json(license);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a license
router.delete('/:id', async (req, res) => {
  try {
    const license = await License.findOneAndDelete({ _id: req.params.id, tenant: req.tenant._id });
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }
    res.json({ message: 'License deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
