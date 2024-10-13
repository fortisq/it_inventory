const HelpDocument = require('../models/HelpDocument');
const HelpRequest = require('../models/HelpRequest');

// Help Document Controllers
exports.getAllHelpDocuments = async (req, res) => {
  try {
    const documents = await HelpDocument.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching help documents', error: error.message });
  }
};

exports.getHelpDocument = async (req, res) => {
  try {
    const document = await HelpDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Help document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching help document', error: error.message });
  }
};

exports.createHelpDocument = async (req, res) => {
  try {
    const newDocument = new HelpDocument({
      ...req.body,
      createdBy: req.user._id
    });
    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    res.status(400).json({ message: 'Error creating help document', error: error.message });
  }
};

exports.updateHelpDocument = async (req, res) => {
  try {
    const updatedDocument = await HelpDocument.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedDocument) {
      return res.status(404).json({ message: 'Help document not found' });
    }
    res.json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: 'Error updating help document', error: error.message });
  }
};

exports.deleteHelpDocument = async (req, res) => {
  try {
    const deletedDocument = await HelpDocument.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return res.status(404).json({ message: 'Help document not found' });
    }
    res.json({ message: 'Help document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting help document', error: error.message });
  }
};

// Help Request Controllers
exports.getAllHelpRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ tenant: req.user.tenant });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching help requests', error: error.message });
  }
};

exports.getHelpRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findOne({ _id: req.params.id, tenant: req.user.tenant });
    if (!request) {
      return res.status(404).json({ message: 'Help request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching help request', error: error.message });
  }
};

exports.createHelpRequest = async (req, res) => {
  try {
    const newRequest = new HelpRequest({
      ...req.body,
      createdBy: req.user._id,
      tenant: req.user.tenant,
      adminNotified: false,
      userNotified: false
    });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error creating help request', error: error.message });
  }
};

exports.updateHelpRequest = async (req, res) => {
  try {
    const updatedRequest = await HelpRequest.findOneAndUpdate(
      { _id: req.params.id, tenant: req.user.tenant },
      { 
        ...req.body, 
        updatedAt: Date.now(),
        userNotified: req.body.status === 'resolved' || req.body.status === 'closed' ? false : req.body.userNotified
      },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error updating help request', error: error.message });
  }
};

exports.addCommentToHelpRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findOne({ _id: req.params.id, tenant: req.user.tenant });
    if (!request) {
      return res.status(404).json({ message: 'Help request not found' });
    }
    request.comments.push({
      content: req.body.content,
      createdBy: req.user._id
    });
    request.userNotified = false;
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment to help request', error: error.message });
  }
};

// System Updates Controller
exports.getSystemUpdates = async (req, res) => {
  // This is a placeholder. In a real application, you would fetch actual system updates.
  const updates = [
    { id: 1, date: '2023-05-15', description: 'New feature: Help and Support Portal launched' },
    { id: 2, date: '2023-05-10', description: 'Performance improvements and bug fixes' },
    { id: 3, date: '2023-05-05', description: 'Security enhancements implemented' }
  ];
  res.json(updates);
};

// Notification Controllers
exports.getAdminNotifications = async (req, res) => {
  try {
    const newRequests = await HelpRequest.find({ adminNotified: false, status: 'open' });
    res.json(newRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin notifications', error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    console.log('User object in getUserNotifications:', req.user);
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated or user ID not found' });
    }
    const updatedRequests = await HelpRequest.find({ 
      createdBy: req.user._id, 
      userNotified: false,
      $or: [{ status: 'resolved' }, { status: 'closed' }]
    });
    res.json(updatedRequests);
  } catch (error) {
    console.error('Error in getUserNotifications:', error);
    res.status(500).json({ message: 'Error fetching user notifications', error: error.message });
  }
};

exports.markAdminNotificationAsRead = async (req, res) => {
  try {
    const updatedRequest = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      { adminNotified: true },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error updating notification status', error: error.message });
  }
};

exports.markUserNotificationAsRead = async (req, res) => {
  try {
    const updatedRequest = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      { userNotified: true },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error updating notification status', error: error.message });
  }
};
