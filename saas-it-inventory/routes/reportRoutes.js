const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all reports
router.get('/', reportController.getAllReports);

// Get a specific report
router.get('/:id', reportController.getReport);

// Generate a report
router.post('/:id/generate', reportController.generateReport);

module.exports = router;
