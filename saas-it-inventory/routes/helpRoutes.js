const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const helpController = require('../controllers/helpController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Help Document routes
router.get('/documents', helpController.getAllHelpDocuments);
router.get('/documents/:id', helpController.getHelpDocument);
router.post('/documents', helpController.createHelpDocument);
router.put('/documents/:id', helpController.updateHelpDocument);
router.delete('/documents/:id', helpController.deleteHelpDocument);

// Help Request routes
router.get('/requests', helpController.getAllHelpRequests);
router.get('/requests/:id', helpController.getHelpRequest);
router.post('/requests', helpController.createHelpRequest);
router.put('/requests/:id', helpController.updateHelpRequest);
router.post('/requests/:id/comments', helpController.addCommentToHelpRequest);

// System Updates route
router.get('/updates', helpController.getSystemUpdates);

// Notification routes
router.get('/notifications/admin', helpController.getAdminNotifications);
router.get('/notifications/user', helpController.getUserNotifications);
router.put('/notifications/admin/:id', helpController.markAdminNotificationAsRead);
router.put('/notifications/user/:id', helpController.markUserNotificationAsRead);

module.exports = router;
