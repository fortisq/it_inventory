const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

router.get('/', subscriptionController.getAllSubscriptions);
router.post('/', subscriptionController.createSubscription);
router.get('/:id', subscriptionController.getSubscription);
router.put('/:id', subscriptionController.updateSubscription);
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;
