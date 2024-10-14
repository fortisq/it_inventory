const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configurationController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', configurationController.getConfigurations);
router.post('/', isAdmin, configurationController.createConfiguration);
router.put('/:id', isAdmin, configurationController.updateConfiguration);
router.delete('/:id', isAdmin, configurationController.deleteConfiguration);

module.exports = router;
