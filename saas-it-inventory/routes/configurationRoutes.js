const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configurationController');
const { authMiddleware, isSuperAdmin, isTenantAdminOrSuperAdmin } = require('../middleware/authMiddleware');

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

router.get('/', configurationController.getConfigurations);
router.post('/', isTenantAdminOrSuperAdmin, configurationController.createConfiguration);
router.put('/', isTenantAdminOrSuperAdmin, configurationController.updateConfiguration);
router.delete('/:key', isTenantAdminOrSuperAdmin, configurationController.deleteConfiguration);

// Add these new routes
router.get('/systems', configurationController.getSystems);
router.get('/application-title', configurationController.getApplicationTitle);

module.exports = router;
