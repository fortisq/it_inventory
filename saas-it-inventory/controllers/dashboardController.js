const Asset = require('../models/Asset');
const SoftwareSubscription = require('../models/SoftwareSubscription');
const Inventory = require('../models/Inventory');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalAssets = await Asset.countDocuments();
    const activeSubscriptions = await SoftwareSubscription.countDocuments({ status: 'active' });
    const lowStockItems = await Inventory.countDocuments({ quantity: { $lt: 10 } });

    res.json({
      totalAssets,
      activeSubscriptions,
      lowStockItems
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
