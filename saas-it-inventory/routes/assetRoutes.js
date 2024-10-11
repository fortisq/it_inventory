const express = require('express');
const Asset = require('../models/Asset');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all asset routes
router.use(authMiddleware);

// Create a new asset
router.post('/', async (req, res) => {
  try {
    const asset = new Asset({
      ...req.body,
      tenant: req.tenant._id
    });
    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all assets for the tenant
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find({ tenant: req.tenant._id });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific asset
router.get('/:id', async (req, res) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, tenant: req.tenant._id });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an asset
router.patch('/:id', async (req, res) => {
  try {
    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.json(asset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an asset
router.delete('/:id', async (req, res) => {
  try {
    const asset = await Asset.findOneAndDelete({ _id: req.params.id, tenant: req.tenant._id });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
