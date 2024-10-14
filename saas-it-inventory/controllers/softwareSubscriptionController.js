const SoftwareSubscription = require('../models/SoftwareSubscription');

const softwareSubscriptionController = {
  getSubscriptions: async (req, res) => {
    try {
      const subscriptions = await SoftwareSubscription.find();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addSubscription: async (req, res) => {
    const subscription = new SoftwareSubscription(req.body);
    try {
      const newSubscription = await subscription.save();
      res.status(201).json(newSubscription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateSubscription: async (req, res) => {
    try {
      const updatedSubscription = await SoftwareSubscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedSubscription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteSubscription: async (req, res) => {
    try {
      await SoftwareSubscription.findByIdAndDelete(req.params.id);
      res.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = softwareSubscriptionController;
