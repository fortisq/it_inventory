const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Inventory = require('../models/Inventory');
const Asset = require('../models/Asset');
const Subscription = require('../models/Subscription');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const totalAssets = await Asset.countDocuments();
    const totalInventoryItems = await Inventory.countDocuments();
    const activeSoftwareSubscriptions = await Subscription.countDocuments({ status: 'active' });

    const assetDistribution = await Asset.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const inventoryStatus = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          inStock: { $sum: { $cond: [{ $gt: ['$quantity', 10] }, 1, 0] } },
          lowStock: { $sum: { $cond: [{ $and: [{ $lte: ['$quantity', 10] }, { $gt: ['$quantity', 0] }] }, 1, 0] } },
          outOfStock: { $sum: { $cond: [{ $eq: ['$quantity', 0] }, 1, 0] } }
        }
      }
    ]);

    const dashboardData = {
      totalAssets,
      totalInventoryItems,
      activeSoftwareSubscriptions,
      assetDistribution: Object.fromEntries(assetDistribution.map(item => [item._id, item.count])),
      inventoryStatus: inventoryStatus[0] || { inStock: 0, lowStock: 0, outOfStock: 0 },
      lowStockItems: inventoryStatus[0] ? inventoryStatus[0].lowStock : 0
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router;
