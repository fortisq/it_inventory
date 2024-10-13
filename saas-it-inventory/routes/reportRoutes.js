const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/assets', reportController.getAssetReport);
router.get('/subscriptions', reportController.getSubscriptionReport);

module.exports = router;
