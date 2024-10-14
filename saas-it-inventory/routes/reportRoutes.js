const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Get asset report
router.get('/assets', reportController.getAssetReport);

// Get subscription report
router.get('/subscriptions', reportController.getSubscriptionReport);

// Get inventory report
router.get('/inventory', reportController.getInventoryReport);

// Generate report (PDF or Excel)
router.get('/generate/:reportType/:format', reportController.generateReport);

module.exports = router;
