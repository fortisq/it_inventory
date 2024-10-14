const express = require('express');
const router = express.Router();
const softwareSubscriptionController = require('../controllers/softwareSubscriptionController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', softwareSubscriptionController.getSubscriptions);
router.post('/', softwareSubscriptionController.addSubscription);
router.put('/:id', softwareSubscriptionController.updateSubscription);
router.delete('/:id', softwareSubscriptionController.deleteSubscription);

module.exports = router;
