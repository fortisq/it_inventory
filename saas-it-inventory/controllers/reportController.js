const Asset = require('../models/Asset');
const SoftwareSubscription = require('../models/SoftwareSubscription');

exports.getAssetReport = async (req, res) => {
  try {
    const totalAssets = await Asset.countDocuments();
    const assetsByStatus = await Asset.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const assetsByType = await Asset.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const report = {
      totalAssets,
      assetsByStatus: Object.fromEntries(assetsByStatus.map(item => [item._id, item.count])),
      assetsByType: Object.fromEntries(assetsByType.map(item => [item._id, item.count]))
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating asset report', error: error.message });
  }
};

exports.getSubscriptionReport = async (req, res) => {
  try {
    const totalSubscriptions = await SoftwareSubscription.countDocuments();
    const totalSeats = await SoftwareSubscription.aggregate([
      { $group: { _id: null, total: { $sum: '$seats' } } }
    ]);
    const subscriptionsByVendor = await SoftwareSubscription.aggregate([
      { $group: { _id: '$vendor', count: { $sum: 1 } } }
    ]);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringSoon = await SoftwareSubscription.countDocuments({
      expirationDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
    });

    const report = {
      totalSubscriptions,
      totalSeats: totalSeats[0]?.total || 0,
      subscriptionsByVendor: Object.fromEntries(subscriptionsByVendor.map(item => [item._id, item.count])),
      expiringSoon
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating subscription report', error: error.message });
  }
};
