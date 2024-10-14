const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', assetController.getAssets);
router.post('/', assetController.addAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
