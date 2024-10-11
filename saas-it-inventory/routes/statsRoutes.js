const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const Asset = require('../models/Asset');

// Get tenant statistics
router.get('/tenants', async (req, res) => {
  try {
    const stats = await Tenant.aggregate([
      {
        $group: {
          _id: '$planType',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      basic: 0,
      pro: 0,
      enterprise: 0
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenant statistics', error: error.message });
  }
});

// Get user statistics (new users in the last 7 days)
router.get('/users', async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const stats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user statistics', error: error.message });
  }
});

// Get asset statistics
router.get('/assets', async (req, res) => {
  try {
    const stats = await Asset.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {};
    stats.forEach(stat => {
      result[stat._id] = stat.count;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching asset statistics', error: error.message });
  }
});

module.exports = router;
