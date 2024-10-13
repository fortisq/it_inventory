const SoftwareSubscription = require('../models/SoftwareSubscription');

exports.getSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search, 'i');
    const query = {
      $or: [
        { name: searchRegex },
        { vendor: searchRegex }
      ]
    };

    const totalSubscriptions = await SoftwareSubscription.countDocuments(query);
    const subscriptions = await SoftwareSubscription.find(query).skip(skip).limit(limit);

    res.json({
      subscriptions,
      currentPage: page,
      totalPages: Math.ceil(totalSubscriptions / limit),
      totalSubscriptions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching software subscriptions', error: error.message });
  }
};

exports.addSubscription = async (req, res) => {
  try {
    const { name, vendor, licenseType, expirationDate, seats } = req.body;
    const newSubscription = new SoftwareSubscription({
      name,
      vendor,
      licenseType,
      expirationDate,
      seats,
      createdBy: req.user._id
    });
    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(500).json({ message: 'Error adding software subscription', error: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, vendor, licenseType, expirationDate, seats } = req.body;
    const updatedSubscription = await SoftwareSubscription.findByIdAndUpdate(
      id,
      { name, vendor, licenseType, expirationDate, seats },
      { new: true }
    );
    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Software subscription not found' });
    }
    res.json(updatedSubscription);
  } catch (error) {
    res.status(500).json({ message: 'Error updating software subscription', error: error.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubscription = await SoftwareSubscription.findByIdAndDelete(id);
    if (!deletedSubscription) {
      return res.status(404).json({ message: 'Software subscription not found' });
    }
    res.json({ message: 'Software subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting software subscription', error: error.message });
  }
};
