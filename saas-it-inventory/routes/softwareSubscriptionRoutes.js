const express = require('express');
const router = express.Router();
const SoftwareSubscription = require('../models/SoftwareSubscription');
const authMiddleware = require('../middleware/authMiddleware');
const { errorHandler } = require('../utils/errorHandler');

// Get all software subscriptions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const subscriptions = await SoftwareSubscription.find({ tenantId: req.user.tenantId });
    res.json(subscriptions);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Get a single software subscription
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const subscription = await SoftwareSubscription.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!subscription) {
      return res.status(404).json({ message: 'Software subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Create a new software subscription
router.post('/', authMiddleware, async (req, res) => {
  try {
    const subscription = new SoftwareSubscription({
      ...req.body,
      tenantId: req.user.tenantId
    });
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Update a software subscription
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const subscription = await SoftwareSubscription.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!subscription) {
      return res.status(404).json({ message: 'Software subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Delete a software subscription
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const subscription = await SoftwareSubscription.findOneAndDelete({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!subscription) {
      return res.status(404).json({ message: 'Software subscription not found' });
    }
    res.json({ message: 'Software subscription deleted successfully' });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

module.exports = router;
