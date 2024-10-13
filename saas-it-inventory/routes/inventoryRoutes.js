const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { validateInventoryItem } = require('../middleware/validationMiddleware');
const inventoryController = require('../controllers/inventoryController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Inventory routes
router.get('/', inventoryController.getAllInventoryItems);
router.post('/', validateInventoryItem, inventoryController.createInventoryItem);
router.get('/:id', inventoryController.getInventoryItem);
router.put('/:id', validateInventoryItem, inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);

// Add a route for pagination
router.get('/page/:page', inventoryController.getPaginatedInventoryItems);

// Add a route for searching inventory items
router.get('/search/:query', inventoryController.searchInventoryItems);

module.exports = router;
