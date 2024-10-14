const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configurationController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdminMiddleware');

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

router.get('/', configurationController.getConfigurations);
router.post('/', isAdmin, configurationController.createConfiguration);
router.put('/', isAdmin, configurationController.updateConfiguration);
router.delete('/:key', isAdmin, configurationController.deleteConfiguration);

// Add these new routes
router.get('/systems', configurationController.getSystems);
router.get('/application-title', configurationController.getApplicationTitle);

module.exports = router;
