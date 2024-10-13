const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const inventoryController = require('../controllers/inventoryController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Inventory routes
router.get('/', inventoryController.getAllInventoryItems);
router.post('/', inventoryController.createInventoryItem);
router.get('/:id', inventoryController.getInventoryItem);
router.put('/:id', inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);

module.exports = router;
